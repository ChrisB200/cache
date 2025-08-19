import { db } from "../config/database";
import plaidClient from "../config/plaid";
import { AccountBase, CountryCode } from "plaid";
import { supabase } from "../config/supabase";
import {
  BankAccounts,
  BankInstitutions,
  BankItems,
  PlaidAccountSubtype,
  PlaidAccountType,
} from "../types/db";
import type { Selectable } from "kysely";
import { isUser } from "./userService";
import AppError from "../utils/appError";

const autoPosition = async (userId: string) => {
  const exists = isUser(userId);
  if (!exists) throw new AppError("user not found");

  const max = await db
    .selectFrom("bankAccounts")
    .innerJoin("bankItems", "bankItemId", "bankItems.id")
    .where("bankItems.userId", "=", userId)
    .select((eb) => eb.fn.max<number>("bankAccounts.position").as("max_value"))
    .executeTakeFirst();

  return max?.max_value ? max.max_value : 0;
};

async function uploadInstitutionLogo(
  image: string | null | undefined,
  institutionId: string,
): Promise<string | null> {
  if (!image) return null;
  try {
    // Clean up base64 string
    image = image.trim();
    const padding = "=".repeat((4 - (image.length % 4)) % 4);
    const base64 = image + padding;

    // Convert base64 to binary
    const imageData = Buffer.from(base64, "base64");

    const filePath = `images/${institutionId}.png`;

    const { data, error } = await supabase.storage
      .from("institutions")
      .upload(filePath, imageData, {
        contentType: "image/png",
      });

    console.log(data);

    if (error) {
      console.error("Upload failed:", error.message);
      return null;
    }

    return data?.path ?? null;
  } catch (err) {
    console.error("Unexpected error during upload:", err);
    return null;
  }
}

const createInstitution = async (institutionId: string) => {
  const exists = await db
    .selectFrom("bankInstitutions")
    .selectAll()
    .where("plaidInstitutionId", "=", institutionId)
    .executeTakeFirst();

  if (exists) return exists;

  const res = await plaidClient.institutionsGetById({
    institution_id: institutionId,
    country_codes: [CountryCode.Gb],
    options: {
      include_optional_metadata: true,
    },
  });

  const { name, logo } = res.data.institution;
  console.log(res.data.institution);

  const path = await uploadInstitutionLogo(logo, institutionId);

  const institution: Selectable<BankInstitutions> = await db
    .insertInto("bankInstitutions")
    .values({ plaidInstitutionId: institutionId, logoUrl: path, name })
    .returningAll()
    .executeTakeFirstOrThrow();

  return institution;
};

const createAccounts = async (
  accounts: AccountBase[],
  item: Selectable<BankItems>,
) => {
  const bankAccounts: Selectable<BankAccounts>[] = [];

  let position = await autoPosition(item.userId);
  if (position != 0) position += 1;
  for (let a of accounts) {
    const exists = await db
      .selectFrom("bankAccounts")
      .selectAll()
      .where("plaidAccountId", "=", a.account_id)
      .executeTakeFirst();

    if (exists) continue;

    const bankAccount = (await db
      .insertInto("bankAccounts")
      .values({
        plaidAccountId: a.account_id,
        name: a.name,
        type: a.type as PlaidAccountType,
        subtype: a.subtype! as PlaidAccountSubtype,
        balance: a.balances.current,
        bankItemId: item.id,
        position,
      })
      .returningAll()
      .executeTakeFirstOrThrow()) as Selectable<BankAccounts>;

    bankAccounts.push(bankAccount);
    position += 1;
  }

  return bankAccounts;
};

const createItem = async (
  itemId: string,
  accessToken: string,
  institutionId: string,
  userId: string,
) => {
  const item = await db
    .insertInto("bankItems")
    .values({
      plaidItemId: itemId,
      plaidAccessToken: accessToken,
      bankInstitutionId: institutionId,
      userId,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return item;
};

export { uploadInstitutionLogo, createInstitution, createAccounts, createItem };

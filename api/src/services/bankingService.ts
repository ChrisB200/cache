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

const autoPosition = async (user_id: string) => {
  const exists = isUser(user_id);
  if (!exists) throw new AppError("user not found");

  const max = await db
    .selectFrom("bank_accounts")
    .innerJoin("bank_items", "bank_item_id", "bank_items.id")
    .where("bank_items.user_id", "=", user_id)
    .select((eb) => eb.fn.max<number>("bank_accounts.position").as("max_value"))
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

const createInstitution = async (institution_id: string) => {
  const exists = await db
    .selectFrom("bank_institutions")
    .selectAll()
    .where("plaid_institution_id", "=", institution_id)
    .executeTakeFirst();

  if (exists) return exists;

  const res = await plaidClient.institutionsGetById({
    institution_id,
    country_codes: [CountryCode.Gb],
    options: {
      include_optional_metadata: true,
    },
  });

  const { name, logo } = res.data.institution;
  console.log(res.data.institution);

  const path = await uploadInstitutionLogo(logo, institution_id);

  const institution: Selectable<BankInstitutions> = await db
    .insertInto("bank_institutions")
    .values({ plaid_institution_id: institution_id, logo_url: path, name })
    .returningAll()
    .executeTakeFirstOrThrow();

  return institution;
};

const createAccounts = async (
  accounts: AccountBase[],
  item: Selectable<BankItems>,
) => {
  const bankAccounts: Selectable<BankAccounts>[] = [];

  let position = await autoPosition(item.user_id);
  if (position != 0) position += 1;
  for (let a of accounts) {
    const exists = await db
      .selectFrom("bank_accounts")
      .selectAll()
      .where("plaid_account_id", "=", a.account_id)
      .executeTakeFirst();

    if (exists) continue;

    const bankAccount = (await db
      .insertInto("bank_accounts")
      .values({
        plaid_account_id: a.account_id,
        name: a.name,
        type: a.type as PlaidAccountType,
        subtype: a.subtype! as PlaidAccountSubtype,
        balance: a.balances.current,
        bank_item_id: item.id,
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
  item_id: string,
  access_token: string,
  institution_id: string,
  user_id: string,
) => {
  const item = await db
    .insertInto("bank_items")
    .values({
      plaid_item_id: item_id,
      plaid_access_token: access_token,
      bank_institution_id: institution_id,
      user_id,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return item;
};

export { uploadInstitutionLogo, createInstitution, createAccounts, createItem };

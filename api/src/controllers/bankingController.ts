import { RequestHandler } from "express";
import { CountryCode, Products } from "plaid";
import env from "../config/constants";
import { db } from "../config/database";
import plaidClient from "../config/plaid";
import AppError from "../utils/appError";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import {
  createAccounts,
  createInstitution,
  createItem,
} from "../services/bankingService";

const createLinkToken: RequestHandler = async (req, res) => {
  const user = req.session.user!;

  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: user.id },
    client_name: "Cache",
    products: [Products.Transactions],
    language: "en",
    webhook: `${env.FRONTEND_URL}/plaid/webhook`,
    country_codes: [CountryCode.Gb],
  });

  res.status(200).json(response.data.link_token);
};

const exchangePublicToken: RequestHandler = async (req, res) => {
  const { public_token } = req.body;

  const user = req.session.user!;

  if (!public_token)
    throw new AppError("No public token was provided", 400, "INVALID_FIELDS");

  // exchange details for accounts
  const exchangeRes = await plaidClient.itemPublicTokenExchange({
    public_token,
  });
  const { access_token, item_id } = exchangeRes.data;

  // get accounts from access token
  const accountsRes = await plaidClient.accountsGet({ access_token });
  const { accounts, item: itemRes } = accountsRes.data;
  const institution_id = itemRes.institution_id!;

  const institution = await createInstitution(institution_id);
  const item = await createItem(item_id, access_token, institution.id, user.id);
  const bankAccounts = await createAccounts(accounts, item);

  res.status(200).json("success");
};

const getBankCards: RequestHandler = async (req, res) => {
  const user = req.session.user!;

  const bankCards = await db
    .selectFrom("bankAccounts")
    .innerJoin("bankItems", "bankItemId", "bankItems.id")
    .where("bankItems.userId", "=", user.id)
    .select((eb) => [
      "bankAccounts.id",
      "bankAccounts.name",
      "bankAccounts.nickname",
      "bankAccounts.type",
      "bankAccounts.balance",
      "bankAccounts.subtype",
      "bankAccounts.position",
      "bankItems.expired",
      "bankItems.plaidAccessToken as accessToken",
      jsonObjectFrom(
        eb
          .selectFrom("bankInstitutions")
          .select([
            "bankInstitutions.id",
            "bankInstitutions.name",
            "bankInstitutions.logoUrl",
          ])
          .whereRef("bankInstitutions.id", "=", "bankItems.bankInstitutionId"),
      ).as("institution"),
    ])
    .orderBy("bankAccounts.position", "asc")
    .execute();

  res.status(200).json(bankCards);
};

const updateNickname: RequestHandler = async (req, res) => {
  const { nickname } = req.body;
  const { bankAccountId } = req.params;

  if (!nickname)
    throw new AppError("No nickname was provided", 400, "INVALID_FIELDS");

  if (nickname.length < 1)
    throw new AppError("Nickname too short", 400, "INVALID_FIELDS");

  if (nickname.length > 35)
    throw new AppError("Nickname too long", 400, "INVALID_FIELDS");

  await db
    .updateTable("bankAccounts")
    .set({ nickname })
    .where("id", "=", bankAccountId)
    .executeTakeFirstOrThrow();

  res.status(200).json("success");
};

const changeBankPosition: RequestHandler = async (req, res) => {
  const { bankAccountId } = req.params;
  let { newPosition } = req.body;
  const user = req.session.user!;

  if (!bankAccountId)
    throw new AppError("No bank id was provided", 400, "INVALID_FIELDS");

  if (!newPosition && newPosition !== 0)
    throw new AppError("No new position was provided", 400, "INVALID_FIELDS");

  const bankAccount = await db
    .selectFrom("bankAccounts")
    .selectAll()
    .where("id", "=", bankAccountId)
    .executeTakeFirstOrThrow();

  const bankAccounts = await db
    .selectFrom("bankAccounts")
    .innerJoin("bankItems", "bankItemId", "bankItems.id")
    .select(["bankAccounts.id as id", "position"])
    .where("userId", "=", user.id)
    .orderBy("bankAccounts.position", "asc")
    .execute();

  if (bankAccounts.length === 0)
    throw new AppError("No bank accounts", 400, "NO_BANK_ACCOUNTS");

  // caps the new position
  newPosition = parseInt(newPosition);
  newPosition = Math.max(0, Math.min(newPosition, bankAccounts.length - 1));

  // get subset of accounts that are going to be moved
  let incrementsBy = 0;
  let currentPosition = bankAccount.position;
  let subset: typeof bankAccounts = [];

  if (newPosition > currentPosition) {
    subset = bankAccounts.slice(currentPosition + 1, newPosition + 1);
    incrementsBy = -1;
  } else {
    subset = bankAccounts.slice(newPosition, currentPosition);
    incrementsBy = 1;
  }

  // update bank account to the new position
  await db
    .updateTable("bankAccounts")
    .set({ position: newPosition })
    .where("bankAccounts.id", "=", bankAccount.id)
    .executeTakeFirstOrThrow();

  for (let a of subset) {
    const position = a.position + incrementsBy;
    await db
      .updateTable("bankAccounts")
      .set({ position })
      .where("bankAccounts.id", "=", a.id)
      .executeTakeFirstOrThrow();
  }

  return res.status(200).json("success");
};

export {
  createLinkToken,
  exchangePublicToken,
  getBankCards,
  updateNickname,
  changeBankPosition,
};

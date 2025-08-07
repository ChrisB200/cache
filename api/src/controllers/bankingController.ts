import { RequestHandler } from "express";
import { CountryCode, Products } from "plaid";
import env from "../config/constants";
import { db } from "../config/database";
import plaidClient from "../config/plaid";
import { PlaidAccountSubtype, PlaidAccountType } from "../types/db";
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
    .selectFrom("bank_accounts")
    .innerJoin("bank_items", "bank_item_id", "bank_items.id")
    .where("bank_items.user_id", "=", user.id)
    .select((eb) => [
      "bank_accounts.id",
      "bank_accounts.name",
      "bank_accounts.nickname",
      "bank_accounts.type",
      "bank_accounts.balance",
      "bank_accounts.subtype",
      "bank_accounts.position",
      "bank_items.expired",
      "bank_items.plaid_access_token as access_token",
      jsonObjectFrom(
        eb
          .selectFrom("bank_institutions")
          .select([
            "bank_institutions.id",
            "bank_institutions.name",
            "bank_institutions.logo_url",
          ])
          .whereRef(
            "bank_institutions.id",
            "=",
            "bank_items.bank_institution_id",
          ),
      ).as("institution"),
    ])
    .orderBy("bank_accounts.position", "asc")
    .execute();

  res.status(200).json(bankCards);
};

const updateNickname: RequestHandler = async (req, res) => {
  const { nickname } = req.body;
  const { bank_account_id } = req.params;

  if (!nickname)
    throw new AppError("No nickname was provided", 400, "INVALID_FIELDS");

  if (nickname.length < 1)
    throw new AppError("Nickname too short", 400, "INVALID_FIELDS");

  if (nickname.length > 35)
    throw new AppError("Nickname too long", 400, "INVALID_FIELDS");

  await db
    .updateTable("bank_accounts")
    .set({ nickname })
    .where("id", "=", bank_account_id)
    .executeTakeFirstOrThrow();

  res.status(200).json("success");
};

const changeBankPosition: RequestHandler = async (req, res) => {
  const { bank_account_id } = req.params;
  let { new_position } = req.body;
  const user = req.session.user!;

  if (!bank_account_id)
    throw new AppError("No bank id was provided", 400, "INVALID_FIELDS");

  if (!new_position && new_position !== 0)
    throw new AppError("No new position was provided", 400, "INVALID_FIELDS");

  const bankAccount = await db
    .selectFrom("bank_accounts")
    .selectAll()
    .where("id", "=", bank_account_id)
    .executeTakeFirstOrThrow();

  const bankAccounts = await db
    .selectFrom("bank_accounts")
    .innerJoin("bank_items", "bank_item_id", "bank_items.id")
    .select(["bank_accounts.id as id", "position"])
    .where("user_id", "=", user.id)
    .orderBy("bank_accounts.position", "asc")
    .execute();

  if (bankAccounts.length === 0)
    throw new AppError("No bank accounts", 400, "NO_BANK_ACCOUNTS");

  // caps the new position
  new_position = parseInt(new_position);
  new_position = Math.max(0, Math.min(new_position, bankAccounts.length - 1));

  // get subset of accounts that are going to be moved
  let incrementsBy = 0;
  let currentPosition = bankAccount.position;
  let subset: typeof bankAccounts = [];

  if (new_position > currentPosition) {
    subset = bankAccounts.slice(currentPosition + 1, new_position + 1);
    incrementsBy = -1;
  } else {
    subset = bankAccounts.slice(new_position, currentPosition);
    incrementsBy = 1;
  }

  // update bank account to the new position
  await db
    .updateTable("bank_accounts")
    .set({ position: new_position })
    .where("bank_accounts.id", "=", bankAccount.id)
    .executeTakeFirstOrThrow();

  for (let a of subset) {
    const position = a.position + incrementsBy;
    await db
      .updateTable("bank_accounts")
      .set({ position: position })
      .where("bank_accounts.id", "=", a.id)
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

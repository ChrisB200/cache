import { BankInstitutions, PlaidAccountSubtype, PlaidAccountType } from "./db";
import { Selectable } from "kysely";

export interface BankCardRoot {
  id: string;
  name: string;
  nickname: string | null;
  type: PlaidAccountType;
  subtype: PlaidAccountSubtype;
  access_token: string;
}

export interface BankCardRow extends BankCardRoot {
  institution_id: string;
  institution_name: string;
  institution_logo_url: string;
  balance: string | null;
}

export interface BankCard extends BankCardRoot {
  institution: Selectable<Omit<BankInstitutions, "plaid_institution_id">>;
  balance: number;
}

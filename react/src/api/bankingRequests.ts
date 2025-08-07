import type { BankAccount } from "@/types/banking";
import request from "@/utils/request";

const createLinkTokenRequest = async () => {
  return request<string>("get", "banking/create_link_token");
};

const exchangePublicTokenRequest = async (public_token: string) => {
  return request<"success">("post", "banking/exchange_public_token", {
    public_token,
  });
};

const getBankCardsRequest = async () => {
  return request<BankAccount[]>("get", "banking/cards");
};

const updateBankNicknameRequest = async (
  bank_account_id: string,
  nickname: string,
) => {
  return request<"success">("post", `banking/${bank_account_id}/nickname`, {
    nickname,
  });
};

const changeBankPositionRequest = async (
  bank_account_id: string,
  new_position: number,
) => {
  return request<"success">(
    "post",
    `banking/accounts/${bank_account_id}/position/move`,
    { new_position },
  );
};

export {
  createLinkTokenRequest,
  exchangePublicTokenRequest,
  getBankCardsRequest,
  updateBankNicknameRequest,
  changeBankPositionRequest,
};

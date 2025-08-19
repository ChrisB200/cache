import type { BankAccount } from "@/types/banking";
import request from "@/utils/request";

const createLinkTokenRequest = async () => {
  return request<string>("get", "banking/create_link_token");
};

const exchangePublicTokenRequest = async (publicToken: string) => {
  return request<"success">("post", "banking/exchange_public_token", {
    publicToken,
  });
};

const getBankCardsRequest = async () => {
  return request<BankAccount[]>("get", "banking/cards");
};

const updateBankNicknameRequest = async (
  bankAccountId: string,
  nickname: string,
) => {
  return request<"success">("post", `banking/${bankAccountId}/nickname`, {
    nickname,
  });
};

const changeBankPositionRequest = async (
  bankAccountId: string,
  newPosititon: number,
) => {
  return request<"success">(
    "post",
    `banking/accounts/${bankAccountId}/position/move`,
    { newPosititon },
  );
};

export {
  createLinkTokenRequest,
  exchangePublicTokenRequest,
  getBankCardsRequest,
  updateBankNicknameRequest,
  changeBankPositionRequest,
};

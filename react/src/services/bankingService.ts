import {
  changeBankPositionRequest,
  createLinkTokenRequest,
  exchangePublicTokenRequest,
  getBankCardsRequest,
  updateBankNicknameRequest,
} from "@/api/bankingRequests";
import { AppError } from "@/utils/errors";

const createLinkToken = async () => {
  const { data } = await createLinkTokenRequest();
  return data;
};

const exchangePublicToken = async (public_token: string) => {
  const { data } = await exchangePublicTokenRequest(public_token);
  return data;
};

const getBankCards = async () => {
  const { data, ok } = await getBankCardsRequest();
  if (!ok) throw new Error(data.error);

  return data;
};

const updateBankNickname = async (
  bank_account_id: string,
  nickname: string,
) => {
  const { data, ok } = await updateBankNicknameRequest(
    bank_account_id,
    nickname,
  );
  if (ok) return data;

  return AppError({ description: data.error, code: data.code });
};

const changeBankPosition = async (
  bank_account_id: string,
  new_position: number,
) => {
  const { data, ok } = await changeBankPositionRequest(
    bank_account_id,
    new_position,
  );
  if (ok) return data;

  return AppError({ description: data.error, code: data.code });
};

export {
  createLinkToken,
  exchangePublicToken,
  getBankCards,
  updateBankNickname,
  changeBankPosition,
};

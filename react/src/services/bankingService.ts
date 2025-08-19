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

const exchangePublicToken = async (publicToken: string) => {
  const { data } = await exchangePublicTokenRequest(publicToken);
  return data;
};

const getBankCards = async () => {
  const { data, ok } = await getBankCardsRequest();
  if (!ok) throw new Error(data.error);

  return data;
};

const updateBankNickname = async (bankAccountId: string, nickname: string) => {
  const { data, ok } = await updateBankNicknameRequest(bankAccountId, nickname);
  if (ok) return data;

  return AppError({ description: data.error, code: data.code });
};

const changeBankPosition = async (
  bankAccountId: string,
  newPosition: number,
) => {
  const { data, ok } = await changeBankPositionRequest(
    bankAccountId,
    newPosition,
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

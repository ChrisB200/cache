import { encrypt } from "../utils/security";
import { SetupCredentials, ValidateSetupCredentials } from "../types/services";
import AppError from "../utils/appError";
import { convertTimeToDate } from "../utils/datetime";
import { db } from "../config/database";

const validateSetupCredentials = (
  values: ValidateSetupCredentials,
): SetupCredentials => {
  const {
    workplace,
    rate,
    open,
    close,
    fgpUsername,
    fgpPassword,
    sdUsername,
    sdPassword,
  } = values;

  if (!workplace)
    throw new AppError("No workplace was provided", 400, "INVALID_FIELDS");

  if (!rate) throw new AppError("No rate was provided", 400, "INVALID_FIELDS");

  if (!open)
    throw new AppError("No opening time was provided", 400, "INVALID_FIELDS");

  if (!close)
    throw new AppError("No closing time was provided", 400, "INVALID_FIELDS");

  if (!fgpUsername)
    throw new AppError("No fgp username was provided", 400, "INVALID_FIELDS");

  if (!fgpPassword)
    throw new AppError("No fgp password was provided", 400, "INVALID_FIELDS");

  if (!sdUsername)
    throw new AppError("No sd username was provided", 400, "INVALID_FIELDS");

  if (!sdPassword)
    throw new AppError("No sd password was provided", 400, "INVALID_FIELDS");

  const openTime = convertTimeToDate(open);
  const closeTime = convertTimeToDate(close);

  if (openTime > closeTime)
    throw new AppError(
      "Opening time should be before closing time",
      400,
      "INVALID_FIELDS",
    );

  return {
    workplace,
    rate,
    open,
    close,
    fgpUsername: encrypt(fgpUsername),
    fgpPassword: encrypt(fgpPassword),
    sdUsername: encrypt(sdUsername),
    sdPassword: encrypt(sdPassword),
  };
};

const isUser = async (userId: string) => {
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", userId)
    .executeTakeFirst();

  return user ? true : false;
};

export { validateSetupCredentials, isUser };

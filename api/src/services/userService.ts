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
    open,
    close,
    fgp_username,
    fgp_password,
    sd_username,
    sd_password,
  } = values;

  if (!workplace)
    throw new AppError("No workplace was provided", 400, "INVALID_FIELDS");

  if (!open)
    throw new AppError("No opening time was provided", 400, "INVALID_FIELDS");

  if (!close)
    throw new AppError("No closing time was provided", 400, "INVALID_FIELDS");

  if (!fgp_username)
    throw new AppError("No fgp username was provided", 400, "INVALID_FIELDS");

  if (!fgp_password)
    throw new AppError("No fgp password was provided", 400, "INVALID_FIELDS");

  if (!sd_username)
    throw new AppError("No sd username was provided", 400, "INVALID_FIELDS");

  if (!sd_password)
    throw new AppError("No sd password was provided", 400, "INVALID_FIELDS");

  const open_time = convertTimeToDate(open);
  const close_time = convertTimeToDate(close);

  if (open_time > close_time)
    throw new AppError(
      "Opening time should be before closing time",
      400,
      "INVALID_FIELDS",
    );

  return {
    workplace,
    open,
    close,
    fgp_username: encrypt(fgp_username),
    fgp_password: encrypt(fgp_password),
    sd_username: encrypt(sd_username),
    sd_password: encrypt(sd_password),
  };
};

const isUser = async (user_id: string) => {
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", user_id)
    .executeTakeFirst();

  return user ? true : false;
};

export { validateSetupCredentials, isUser };

import { setupFiveGuysRequest } from "@/api/userRequests";
import type { AccountProfile } from "@/pages/ProfileSetup/types";
import { AppError } from "@/utils/errors";

const setupFiveGuys = async (profile: AccountProfile) => {
  const { data, ok } = await setupFiveGuysRequest(profile);
  if (ok) return "success";
  return AppError({ description: data.error });
};

export { setupFiveGuys };

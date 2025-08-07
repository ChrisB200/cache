import type { AccountProfile } from "@/pages/ProfileSetup/types";
import request from "@/utils/request";

const setupFiveGuysRequest = async (profile: AccountProfile) => {
  return request<"success">("post", "users/setup/fiveguys", profile);
};

export { setupFiveGuysRequest };

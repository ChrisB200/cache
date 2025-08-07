import type { User } from "@/types/user";
import request from "@/utils/request";

export const isAuthenticated = async () => {
  return request<User>("get", "auth/authenticated");
};

export const completeSignupRequest = async (values: {
  username: string;
  nickname: string;
}) => {
  return request<{ message: "success" }>(
    "post",
    "auth/signup/complete",
    values
  );
};

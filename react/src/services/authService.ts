import { completeSignupRequest } from "@/api/authRequests";
import supabase from "@/config/supabase";
import type { SignupFormValues } from "@/pages/Signup/types";
import { AppError, handleSupbaseError } from "@/utils/errors";

const signup = async (credentials: SignupFormValues) => {
  const { data, error } = await supabase.auth.signUp(credentials);

  if (data?.user?.user_metadata.email_verified === false)
    return AppError({
      description: "Account needs verifying",
      code: "email_not_confirmed",
    });
  if (error) return handleSupbaseError(error);

  return "success";
};

const confirmCode = async (
  email: string,
  code: string,
  type: "email" | "recovery"
) => {
  const { error } = await supabase.auth.verifyOtp({
    type,
    token: code,
    email,
  });

  if (error) return handleSupbaseError(error);

  return "success";
};

const resendCode = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) return handleSupbaseError(error);

  return "success";
};

const login = async (credentials: SignupFormValues) => {
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) return handleSupbaseError(error);

  return "success";
};

const continueWithGoogle = async (redirect: string) => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?${redirect}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
};

const exchangeCode = async (code: string) => {
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return handleSupbaseError(error);

  return "success";
};

const forgotPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) return handleSupbaseError(error);

  return "success";
};

const resetPassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) return handleSupbaseError(error);

  return "success";
};

const completeSignup = async (values: {
  username: string;
  nickname: string;
}) => {
  const { data, ok } = await completeSignupRequest(values);
  if (ok) return "success";

  return AppError({ description: data.error });
};

const signout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) return handleSupbaseError(error);

  return "success";
};

export {
  signup,
  login,
  continueWithGoogle,
  exchangeCode,
  confirmCode,
  resendCode,
  forgotPassword,
  resetPassword,
  completeSignup,
  signout,
};

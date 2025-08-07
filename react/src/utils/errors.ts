import type { Error } from "@/types/errors";
import type { ApiError, ApiFailure } from "@/types/api";
import axios from "axios";
import type { AuthError } from "@supabase/supabase-js";

export function AppError(values: Error) {
  if (!values.title) values.title = "An error has occured";

  if (!values.code) values.code = "ERROR";

  console.error(values);
  return values;
}

export function handleRequestError(error: unknown): ApiFailure<ApiError> {
  if (axios.isAxiosError(error)) {
    return {
      data: {
        error: error.response?.data?.error || "Unknown API error",
        code: error.response?.data?.code || "UNKNOWN_ERROR",
      },
      status: error.response?.status || 500,
      ok: false,
    };
  }

  return {
    data: { error: "Unexpected error", code: "INTERNAL_SERVER" },
    status: 500,
    ok: false,
  };
}

export function isApiError(response: any): response is ApiError {
  return response && typeof response.error === "string";
}

export function handleSupbaseError(error: AuthError) {
  return AppError({
    description: error.message,
    code: error.code,
  });
}

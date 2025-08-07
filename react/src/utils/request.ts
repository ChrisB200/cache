import api from "@/config/api";
import type { AxiosResponse } from "axios";
import type {
  ApiError,
  ApiFailure,
  ApiResponse,
  ApiSuccess,
} from "@/types/api";
import { handleRequestError } from "@/utils/errors";

async function request<T, R = ApiError>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  config?: object
): Promise<ApiResponse<T, R>> {
  try {
    const response: AxiosResponse<T> = await api({
      method,
      url,
      data,
      ...config,
    });

    return {
      data: response.data,
      status: response.status,
      ok: true,
    } as ApiSuccess<T>;
  } catch (e: any) {
    return handleRequestError(e) as ApiFailure<R>;
  }
}

export default request;

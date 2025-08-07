export interface ApiSuccess<T> {
  data: T;
  status: number;
  ok: true;
}

export interface ApiFailure<T> {
  data: T;
  status: number;
  ok: false;
}

export interface ApiError {
  error: string;
  code: string;
}

export type ApiResponse<T, R = ApiError> = Promise<
  ApiSuccess<T> | ApiFailure<R>
>;

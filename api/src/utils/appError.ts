class AppError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);

    this.status = status;
    this.code = code;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default AppError;

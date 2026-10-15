export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function isNotFound(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}

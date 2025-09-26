export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const badRequest = (message: string, details?: unknown) => new AppError(message, 400, details);
export const unauthorized = (message = 'Unauthorized') => new AppError(message, 401);
export const forbidden = (message = 'Forbidden') => new AppError(message, 403);
export const notFound = (message = 'Not Found') => new AppError(message, 404);

export type ErrorResponse = {
  message: string;
  details?: unknown;
};

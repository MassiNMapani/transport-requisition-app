import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/httpErrors';
import { logger } from '../utils/logger';

// Centralized error handler to normalize API error responses
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : 'Internal Server Error';

  if (!isAppError) {
    logger.error('Unhandled error', { err });
  }

  res.status(status).json({
    message,
    ...(isAppError && err.details ? { details: err.details } : {}),
  });
};

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { registerUser, authenticateUser, toPublicUser } from '../services/authService';
import { badRequest } from '../utils/httpErrors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ user: toPublicUser(user) });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(badRequest('Invalid data provided', error.flatten()));
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authenticateUser(req.body);
    res.json({ token, user: toPublicUser(user) });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(badRequest('Invalid data provided', error.flatten()));
    }
    next(error);
  }
};

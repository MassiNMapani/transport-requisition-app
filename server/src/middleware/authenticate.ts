import { NextFunction, Request, Response } from 'express';
import { verifyAuthToken } from '../services/tokenService';
import { UserModel } from '../models/User';
import { unauthorized, forbidden } from '../utils/httpErrors';
import { UserRole } from '../models/enums';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      throw unauthorized();
    }

    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw unauthorized();
    }

    const payload = verifyAuthToken(token);
    const user = await UserModel.findById(payload.sub);
    if (!user || !user.active) {
      throw unauthorized();
    }

    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.currentUser;
    if (!user) {
      return next(unauthorized());
    }
    if (!roles.includes(user.role)) {
      return next(forbidden());
    }
    next();
  };
};

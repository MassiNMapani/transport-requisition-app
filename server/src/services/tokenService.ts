import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { env } from '../config/env';
import { IUser } from '../models/User';

export interface AuthTokenPayload {
  sub: string;
  role: string;
  employeeId: string;
  name: string;
}

const parseExpiresIn = (value: string | undefined): StringValue | number | undefined => {
  if (!value) {
    return undefined;
  }
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  return value as StringValue;
};

export const createAuthToken = (user: IUser): string => {
  const payload: AuthTokenPayload = {
    sub: user.id,
    role: user.role,
    employeeId: user.employeeId,
    name: user.name,
  };

  const options: SignOptions = {};
  const expiresIn = parseExpiresIn(env.jwtExpiresIn);
  if (expiresIn !== undefined) {
    options.expiresIn = expiresIn;
  }

  return jwt.sign(payload, env.jwtSecret as Secret, options);
};

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, env.jwtSecret as Secret) as AuthTokenPayload;
};

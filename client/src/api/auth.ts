import { apiRequest } from './client';
import type { User } from '../types';

export interface LoginPayload {
  employeeId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = (payload: LoginPayload) =>
  apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

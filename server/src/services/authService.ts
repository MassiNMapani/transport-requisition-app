import { z } from 'zod';
import { UserModel, IUser } from '../models/User';
import { UserRole } from '../models/enums';
import { hashPassword, verifyPassword } from '../utils/password';
import { createAuthToken } from './tokenService';

const registerSchema = z.object({
  employeeId: z.string().min(3).max(20),
  name: z.string().min(1),
  email: z.string().email(),
  department: z.string().min(1).optional(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export interface AuthResult {
  user: IUser;
  token: string;
}

export const registerUser = async (input: RegisterInput): Promise<IUser> => {
  const data = registerSchema.parse(input);
  const existing = await UserModel.findOne({ employeeId: data.employeeId.toUpperCase() });
  if (existing) {
    throw new Error('Employee ID already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const user = new UserModel({
    employeeId: data.employeeId.toUpperCase(),
    name: data.name,
    email: data.email,
    department: data.department,
    passwordHash,
    role: data.role,
  });

  await user.save();
  return user;
};

const loginSchema = z.object({
  employeeId: z.string().min(3),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const authenticateUser = async (input: LoginInput): Promise<AuthResult> => {
  const data = loginSchema.parse(input);
  const employeeId = data.employeeId.toUpperCase();
  const user = await UserModel.findOne({ employeeId, active: true });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordValid = await verifyPassword(data.password, user.passwordHash);
  if (!passwordValid) {
    throw new Error('Invalid credentials');
  }

  const token = createAuthToken(user);
  return { user, token };
};

export const toPublicUser = (user: IUser) => ({
  id: user.id,
  employeeId: user.employeeId,
  name: user.name,
  email: user.email,
  department: user.department,
  role: user.role,
  active: user.active,
});

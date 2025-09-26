import { z } from 'zod';
import { IUser } from '../models/User';
import { UserRole } from '../models/enums';
declare const registerSchema: z.ZodObject<{
    employeeId: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    department: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    role: z.ZodEnum<typeof UserRole>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export interface AuthResult {
    user: IUser;
    token: string;
}
export declare const registerUser: (input: RegisterInput) => Promise<IUser>;
declare const loginSchema: z.ZodObject<{
    employeeId: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const authenticateUser: (input: LoginInput) => Promise<AuthResult>;
export declare const toPublicUser: (user: IUser) => {
    id: any;
    employeeId: string;
    name: string;
    email: string;
    department: string | undefined;
    role: UserRole;
    active: boolean;
};
export {};
//# sourceMappingURL=authService.d.ts.map
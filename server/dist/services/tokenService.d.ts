import { IUser } from '../models/User';
export interface AuthTokenPayload {
    sub: string;
    role: string;
    employeeId: string;
    name: string;
}
export declare const createAuthToken: (user: IUser) => string;
export declare const verifyAuthToken: (token: string) => AuthTokenPayload;
//# sourceMappingURL=tokenService.d.ts.map
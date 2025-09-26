import { Document } from 'mongoose';
import { UserRole } from './enums';
export interface IUser extends Document {
    employeeId: string;
    name: string;
    email: string;
    department?: string;
    passwordHash: string;
    role: UserRole;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map
import { Schema, model, Document } from 'mongoose';
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

const userSchema = new Schema<IUser>(
  {
    employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    department: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.REQUESTOR,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);

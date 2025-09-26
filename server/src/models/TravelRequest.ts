import { Schema, model, Document, Types } from 'mongoose';
import { ApprovalStatus, RequestStatus, UserRole } from './enums';

export interface ITravelerDetail {
  name: string;
  numberOfDays: number;
  perDiemRate: number;
  total: number;
}

export interface IApprovalEntry {
  role: UserRole;
  approver?: Types.ObjectId;
  status: ApprovalStatus;
  decidedAt?: Date;
  comments?: string;
}

export interface ITravelRequest extends Document {
  requestNumber: string;
  requester: Types.ObjectId;
  requesterName: string;
  requesterDepartment?: string;
  description: string;
  destination: string;
  purposeOfTravel: string;
  travelStartDate: Date;
  travelEndDate: Date;
  modeOfTravel: string;
  travelers: ITravelerDetail[];
  vehicleRequired: boolean;
  accommodationRequired: boolean;
  otherRequirements?: string;
  programFee?: number;
  status: RequestStatus;
  approvals: IApprovalEntry[];
  currentApprovalIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

const travelerSchema = new Schema<ITravelerDetail>(
  {
    name: { type: String, required: true, trim: true },
    numberOfDays: { type: Number, required: true, min: 0 },
    perDiemRate: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const approvalSchema = new Schema<IApprovalEntry>(
  {
    role: { type: String, enum: Object.values(UserRole), required: true },
    approver: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: Object.values(ApprovalStatus), default: ApprovalStatus.PENDING },
    decidedAt: { type: Date },
    comments: { type: String, trim: true },
  },
  { _id: false }
);

const travelRequestSchema = new Schema<ITravelRequest>(
  {
    requestNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requesterName: { type: String, required: true, trim: true },
    requesterDepartment: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    purposeOfTravel: { type: String, required: true, trim: true },
    travelStartDate: { type: Date, required: true },
    travelEndDate: { type: Date, required: true },
    modeOfTravel: { type: String, required: true, trim: true },
    travelers: { type: [travelerSchema], default: [] },
    vehicleRequired: { type: Boolean, default: false },
    accommodationRequired: { type: Boolean, default: false },
    otherRequirements: { type: String, trim: true },
    programFee: { type: Number, min: 0 },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.SUBMITTED,
    },
    approvals: { type: [approvalSchema], default: [] },
    currentApprovalIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TravelRequestModel = model<ITravelRequest>('TravelRequest', travelRequestSchema);

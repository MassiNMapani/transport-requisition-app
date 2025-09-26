import { Document, Types } from 'mongoose';
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
export declare const TravelRequestModel: import("mongoose").Model<ITravelRequest, {}, {}, {}, Document<unknown, {}, ITravelRequest, {}, {}> & ITravelRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TravelRequest.d.ts.map
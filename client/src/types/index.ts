export type UserRole =
  | 'REQUESTOR'
  | 'HEAD_OF_DEPARTMENT'
  | 'HEAD_HR_ADMIN'
  | 'CHIEF_EXECUTIVE_OFFICER'
  | 'CHAIRMAN';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department?: string;
  role: UserRole;
  active?: boolean;
}

export interface TravelerDetail {
  name: string;
  numberOfDays: number;
  perDiemRate: number;
  total: number;
}

export interface ApprovalEntry {
  role: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decidedAt?: string;
  comments?: string;
  approver?: string;
}

export interface TravelRequest {
  _id: string;
  requestNumber: string;
  requester: string;
  requesterName: string;
  requesterDepartment?: string;
  description: string;
  destination: string;
  purposeOfTravel: string;
  travelStartDate: string;
  travelEndDate: string;
  modeOfTravel: string;
  travelers: TravelerDetail[];
  vehicleRequired: boolean;
  accommodationRequired: boolean;
  otherRequirements?: string;
  programFee?: number;
  status: string;
  approvals: ApprovalEntry[];
  currentApprovalIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface PendingApprovalItem extends TravelRequest {}

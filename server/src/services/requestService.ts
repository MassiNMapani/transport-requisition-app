import { z } from 'zod';
import { Types } from 'mongoose';
import {
  TravelRequestModel,
  ITravelRequest,
  ITravelerDetail,
  IApprovalEntry,
} from '../models/TravelRequest';
import { ApprovalStatus, RequestStatus, UserRole } from '../models/enums';
import { IUser, UserModel } from '../models/User';
import { generateRequestNumber } from '../utils/requestNumber';
import { badRequest, forbidden, notFound } from '../utils/httpErrors';
import { sendEmail } from './emailService';

const travelerSchema = z.object({
  name: z.string().min(1),
  numberOfDays: z.number().int().min(0),
  perDiemRate: z.number().min(0),
  total: z.number().min(0),
});

const requestSchema = z
  .object({
    description: z.string().min(1),
    destination: z.string().min(1),
    purposeOfTravel: z.string().min(1),
    travelStartDate: z.string().min(1),
    travelEndDate: z.string().min(1),
    modeOfTravel: z.string().min(1),
    travelers: z.array(travelerSchema).min(1),
    vehicleRequired: z.boolean(),
    accommodationRequired: z.boolean(),
    otherRequirements: z.string().min(1).optional(),
    programFee: z.number().min(0).optional(),
  })
  .superRefine((val, ctx) => {
    const start = new Date(val.travelStartDate);
    const end = new Date(val.travelEndDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Travel dates must be valid',
        path: ['travelStartDate'],
      });
      return;
    }
    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Travel end date cannot be before start date',
        path: ['travelEndDate'],
      });
    }
  });

export type CreateRequestInput = z.infer<typeof requestSchema>;

const approvalFlowForRole = (role: UserRole): UserRole[] => {
  switch (role) {
    case UserRole.HEAD_OF_DEPARTMENT:
      return [UserRole.HEAD_HR_ADMIN, UserRole.CHIEF_EXECUTIVE_OFFICER];
    case UserRole.HEAD_HR_ADMIN:
      return [UserRole.CHIEF_EXECUTIVE_OFFICER];
    case UserRole.CHIEF_EXECUTIVE_OFFICER:
      return [UserRole.CHAIRMAN];
    case UserRole.CHAIRMAN:
      return [];
    default:
      return [
        UserRole.HEAD_OF_DEPARTMENT,
        UserRole.HEAD_HR_ADMIN,
        UserRole.CHIEF_EXECUTIVE_OFFICER,
      ];
  }
};

const calculateRequestStatus = (role: UserRole, approvalStatus: ApprovalStatus): RequestStatus => {
  if (approvalStatus === ApprovalStatus.APPROVED) {
    switch (role) {
      case UserRole.HEAD_OF_DEPARTMENT:
        return RequestStatus.HOD_APPROVED;
      case UserRole.HEAD_HR_ADMIN:
        return RequestStatus.HR_APPROVED;
      case UserRole.CHIEF_EXECUTIVE_OFFICER:
        return RequestStatus.CEO_APPROVED;
      case UserRole.CHAIRMAN:
        return RequestStatus.CHAIRMAN_APPROVED;
      default:
        return RequestStatus.SUBMITTED;
    }
  }

  switch (role) {
    case UserRole.HEAD_OF_DEPARTMENT:
      return RequestStatus.HOD_REJECTED;
    case UserRole.HEAD_HR_ADMIN:
      return RequestStatus.HR_REJECTED;
    case UserRole.CHIEF_EXECUTIVE_OFFICER:
      return RequestStatus.CEO_REJECTED;
    case UserRole.CHAIRMAN:
      return RequestStatus.CHAIRMAN_REJECTED;
    default:
      return RequestStatus.HOD_REJECTED;
  }
};

const toDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw badRequest('Invalid date value provided');
  }
  return date;
};

const ensureObjectId = (value: unknown): Types.ObjectId => {
  if (value instanceof Types.ObjectId) {
    return value;
  }
  if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
    return new Types.ObjectId(value);
  }
  throw badRequest('Invalid identifier');
};

const notifyApprovers = async (roles: UserRole[], request: ITravelRequest) => {
  if (!roles.length) {
    return;
  }

  const approvers = await UserModel.find({ role: { $in: roles }, active: true });
  if (!approvers.length) {
    return;
  }

  const subject = `Travel request ${request.requestNumber} pending approval`;
  const text = `Dear approver,

Travel request ${request.requestNumber} from ${request.requesterName} is awaiting your review.
Destination: ${request.destination}
Travel Dates: ${new Date(request.travelStartDate).toDateString()} - ${new Date(
    request.travelEndDate
  ).toDateString()}

Please sign in to the travel portal to take action.
`;

  await Promise.all(
    approvers.map((approver) =>
      sendEmail({ to: approver.email, subject, text })
    )
  );
};

const notifyRequester = async (request: ITravelRequest, message: string) => {
  const requester = await UserModel.findById(request.requester);
  if (!requester) return;

  await sendEmail({
    to: requester.email,
    subject: `Travel request ${request.requestNumber} update`,
    text: message,
  });
};

export const createTravelRequest = async (
  input: CreateRequestInput,
  requester: IUser
): Promise<ITravelRequest> => {
  const data = requestSchema.parse(input);
  const approvalFlow = approvalFlowForRole(requester.role);
  const approvals: IApprovalEntry[] = approvalFlow.map((role) => ({
    role,
    status: ApprovalStatus.PENDING,
  }));

  const request = new TravelRequestModel({
    requestNumber: generateRequestNumber(),
    requester: ensureObjectId(requester._id),
    requesterName: requester.name,
    requesterDepartment: requester.department,
    description: data.description,
    destination: data.destination,
    purposeOfTravel: data.purposeOfTravel,
    travelStartDate: toDate(data.travelStartDate),
    travelEndDate: toDate(data.travelEndDate),
    modeOfTravel: data.modeOfTravel,
    travelers: data.travelers as ITravelerDetail[],
    vehicleRequired: data.vehicleRequired,
    accommodationRequired: data.accommodationRequired,
    otherRequirements: data.otherRequirements,
    programFee: data.programFee,
    status: approvalFlow.length ? RequestStatus.SUBMITTED : RequestStatus.COMPLETED,
    approvals,
    currentApprovalIndex: approvalFlow.length ? 0 : -1,
  });

  await request.save();

  const [firstApprover] = approvalFlow;
  if (firstApprover) {
    await notifyApprovers([firstApprover], request);
  }

  return request;
};

export const listRequestsForUser = async (user: IUser) => {
  return TravelRequestModel.find({ requester: ensureObjectId(user._id) })
    .sort({ createdAt: -1 })
    .lean();
};

export const listPendingApprovals = async (user: IUser) => {
  const requests = await TravelRequestModel.find({ 'approvals.role': user.role })
    .sort({ createdAt: -1 })
    .lean();

  return requests.filter((request) => {
    const index = typeof request.currentApprovalIndex === 'number' ? request.currentApprovalIndex : -1;
    if (index < 0) return false;
    const current = request.approvals[index];
    return current && current.role === user.role && current.status === ApprovalStatus.PENDING;
  });
};

export const getRequestById = async (id: string, user: IUser) => {
  if (!Types.ObjectId.isValid(id)) {
    throw badRequest('Invalid request identifier');
  }
  const request = await TravelRequestModel.findById(id);
  if (!request) {
    throw notFound('Travel request not found');
  }

  const userId = ensureObjectId(user._id);
  const isOwner = request.requester.equals(userId);
  const isApprover = request.approvals.some((approval) => approval.role === user.role);
  if (!isOwner && !isApprover) {
    throw forbidden('You do not have access to this travel request');
  }

  return request;
};

interface ApprovalDecisionInput {
  requestId: string;
  user: IUser;
  decision: 'APPROVE' | 'REJECT';
  comments?: string;
}

const getCurrentApprovalStep = (request: ITravelRequest) => {
  const index = request.currentApprovalIndex;
  if (typeof index !== 'number' || index < 0 || index >= request.approvals.length) {
    return null;
  }
  const entry = request.approvals[index];
  if (!entry) {
    return null;
  }
  return { index, entry };
};

export const decideOnRequest = async ({
  requestId,
  user,
  decision,
  comments,
}: ApprovalDecisionInput) => {
  const request = await getRequestById(requestId, user);

  const currentStep = getCurrentApprovalStep(request);
  if (!currentStep) {
    throw badRequest('This travel request has already completed its approval workflow');
  }

  const { entry: current, index } = currentStep;
  if (current.role !== user.role) {
    throw forbidden('You are not authorized to act on this approval step');
  }
  if (current.status !== ApprovalStatus.PENDING) {
    throw badRequest('This approval step has already been completed');
  }

  current.status = decision === 'APPROVE' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;
  current.decidedAt = new Date();

  const approverId = ensureObjectId(user._id);
  const hasComment = typeof comments === 'string' && comments.trim().length > 0;

  if ('set' in current && typeof (current as any).set === 'function') {
    const update: Record<string, unknown> = { approver: approverId };
    if (hasComment) {
      update.comments = comments;
    } else {
      update.comments = undefined;
    }
    (current as any).set(update);
  } else {
    if (hasComment) {
      (current as IApprovalEntry).comments = comments as string;
    } else if ('comments' in current) {
      delete (current as any).comments;
    }
    (current as IApprovalEntry).approver = approverId;
  }

  request.status = calculateRequestStatus(current.role, current.status);

  if (current.status === ApprovalStatus.APPROVED) {
    request.currentApprovalIndex = index + 1;
    if (request.currentApprovalIndex >= request.approvals.length) {
      request.currentApprovalIndex = -1;
    }
  } else {
    request.currentApprovalIndex = -1;
  }

  await request.save();

  if (current.status === ApprovalStatus.APPROVED) {
    const nextStep = getCurrentApprovalStep(request);
    if (nextStep) {
      await notifyApprovers([nextStep.entry.role], request);
    } else {
      await notifyRequester(
        request,
        `Your travel request ${request.requestNumber} has been fully approved.`
      );
    }
  } else {
    await notifyRequester(
      request,
      `Your travel request ${request.requestNumber} was rejected by ${user.name}.`
    );
  }

  return request;
};

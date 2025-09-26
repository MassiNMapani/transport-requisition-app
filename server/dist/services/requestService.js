"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideOnRequest = exports.getRequestById = exports.listPendingApprovals = exports.listRequestsForUser = exports.createTravelRequest = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const TravelRequest_1 = require("../models/TravelRequest");
const enums_1 = require("../models/enums");
const User_1 = require("../models/User");
const requestNumber_1 = require("../utils/requestNumber");
const httpErrors_1 = require("../utils/httpErrors");
const emailService_1 = require("./emailService");
const travelerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    numberOfDays: zod_1.z.number().int().min(0),
    perDiemRate: zod_1.z.number().min(0),
    total: zod_1.z.number().min(0),
});
const requestSchema = zod_1.z
    .object({
    description: zod_1.z.string().min(1),
    destination: zod_1.z.string().min(1),
    purposeOfTravel: zod_1.z.string().min(1),
    travelStartDate: zod_1.z.string().min(1),
    travelEndDate: zod_1.z.string().min(1),
    modeOfTravel: zod_1.z.string().min(1),
    travelers: zod_1.z.array(travelerSchema).min(1),
    vehicleRequired: zod_1.z.boolean(),
    accommodationRequired: zod_1.z.boolean(),
    otherRequirements: zod_1.z.string().min(1).optional(),
    programFee: zod_1.z.number().min(0).optional(),
})
    .superRefine((val, ctx) => {
    const start = new Date(val.travelStartDate);
    const end = new Date(val.travelEndDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Travel dates must be valid',
            path: ['travelStartDate'],
        });
        return;
    }
    if (end < start) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Travel end date cannot be before start date',
            path: ['travelEndDate'],
        });
    }
});
const approvalFlowForRole = (role) => {
    switch (role) {
        case enums_1.UserRole.HEAD_OF_DEPARTMENT:
            return [enums_1.UserRole.HEAD_HR_ADMIN, enums_1.UserRole.CHIEF_EXECUTIVE_OFFICER];
        case enums_1.UserRole.HEAD_HR_ADMIN:
            return [enums_1.UserRole.CHIEF_EXECUTIVE_OFFICER];
        case enums_1.UserRole.CHIEF_EXECUTIVE_OFFICER:
            return [enums_1.UserRole.CHAIRMAN];
        case enums_1.UserRole.CHAIRMAN:
            return [];
        default:
            return [
                enums_1.UserRole.HEAD_OF_DEPARTMENT,
                enums_1.UserRole.HEAD_HR_ADMIN,
                enums_1.UserRole.CHIEF_EXECUTIVE_OFFICER,
            ];
    }
};
const calculateRequestStatus = (role, approvalStatus) => {
    if (approvalStatus === enums_1.ApprovalStatus.APPROVED) {
        switch (role) {
            case enums_1.UserRole.HEAD_OF_DEPARTMENT:
                return enums_1.RequestStatus.HOD_APPROVED;
            case enums_1.UserRole.HEAD_HR_ADMIN:
                return enums_1.RequestStatus.HR_APPROVED;
            case enums_1.UserRole.CHIEF_EXECUTIVE_OFFICER:
                return enums_1.RequestStatus.CEO_APPROVED;
            case enums_1.UserRole.CHAIRMAN:
                return enums_1.RequestStatus.CHAIRMAN_APPROVED;
            default:
                return enums_1.RequestStatus.SUBMITTED;
        }
    }
    switch (role) {
        case enums_1.UserRole.HEAD_OF_DEPARTMENT:
            return enums_1.RequestStatus.HOD_REJECTED;
        case enums_1.UserRole.HEAD_HR_ADMIN:
            return enums_1.RequestStatus.HR_REJECTED;
        case enums_1.UserRole.CHIEF_EXECUTIVE_OFFICER:
            return enums_1.RequestStatus.CEO_REJECTED;
        case enums_1.UserRole.CHAIRMAN:
            return enums_1.RequestStatus.CHAIRMAN_REJECTED;
        default:
            return enums_1.RequestStatus.HOD_REJECTED;
    }
};
const toDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw (0, httpErrors_1.badRequest)('Invalid date value provided');
    }
    return date;
};
const ensureObjectId = (value) => {
    if (value instanceof mongoose_1.Types.ObjectId) {
        return value;
    }
    if (typeof value === 'string' && mongoose_1.Types.ObjectId.isValid(value)) {
        return new mongoose_1.Types.ObjectId(value);
    }
    throw (0, httpErrors_1.badRequest)('Invalid identifier');
};
const notifyApprovers = async (roles, request) => {
    if (!roles.length) {
        return;
    }
    const approvers = await User_1.UserModel.find({ role: { $in: roles }, active: true });
    if (!approvers.length) {
        return;
    }
    const subject = `Travel request ${request.requestNumber} pending approval`;
    const text = `Dear approver,

Travel request ${request.requestNumber} from ${request.requesterName} is awaiting your review.
Destination: ${request.destination}
Travel Dates: ${new Date(request.travelStartDate).toDateString()} - ${new Date(request.travelEndDate).toDateString()}

Please sign in to the travel portal to take action.
`;
    await Promise.all(approvers.map((approver) => (0, emailService_1.sendEmail)({ to: approver.email, subject, text })));
};
const notifyRequester = async (request, message) => {
    const requester = await User_1.UserModel.findById(request.requester);
    if (!requester)
        return;
    await (0, emailService_1.sendEmail)({
        to: requester.email,
        subject: `Travel request ${request.requestNumber} update`,
        text: message,
    });
};
const createTravelRequest = async (input, requester) => {
    const data = requestSchema.parse(input);
    const approvalFlow = approvalFlowForRole(requester.role);
    const approvals = approvalFlow.map((role) => ({
        role,
        status: enums_1.ApprovalStatus.PENDING,
    }));
    const request = new TravelRequest_1.TravelRequestModel({
        requestNumber: (0, requestNumber_1.generateRequestNumber)(),
        requester: ensureObjectId(requester._id),
        requesterName: requester.name,
        requesterDepartment: requester.department,
        description: data.description,
        destination: data.destination,
        purposeOfTravel: data.purposeOfTravel,
        travelStartDate: toDate(data.travelStartDate),
        travelEndDate: toDate(data.travelEndDate),
        modeOfTravel: data.modeOfTravel,
        travelers: data.travelers,
        vehicleRequired: data.vehicleRequired,
        accommodationRequired: data.accommodationRequired,
        otherRequirements: data.otherRequirements,
        programFee: data.programFee,
        status: approvalFlow.length ? enums_1.RequestStatus.SUBMITTED : enums_1.RequestStatus.COMPLETED,
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
exports.createTravelRequest = createTravelRequest;
const listRequestsForUser = async (user) => {
    return TravelRequest_1.TravelRequestModel.find({ requester: ensureObjectId(user._id) })
        .sort({ createdAt: -1 })
        .lean();
};
exports.listRequestsForUser = listRequestsForUser;
const listPendingApprovals = async (user) => {
    const requests = await TravelRequest_1.TravelRequestModel.find({ 'approvals.role': user.role })
        .sort({ createdAt: -1 })
        .lean();
    return requests.filter((request) => {
        const index = typeof request.currentApprovalIndex === 'number' ? request.currentApprovalIndex : -1;
        if (index < 0)
            return false;
        const current = request.approvals[index];
        return current && current.role === user.role && current.status === enums_1.ApprovalStatus.PENDING;
    });
};
exports.listPendingApprovals = listPendingApprovals;
const getRequestById = async (id, user) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw (0, httpErrors_1.badRequest)('Invalid request identifier');
    }
    const request = await TravelRequest_1.TravelRequestModel.findById(id);
    if (!request) {
        throw (0, httpErrors_1.notFound)('Travel request not found');
    }
    const userId = ensureObjectId(user._id);
    const isOwner = request.requester.equals(userId);
    const isApprover = request.approvals.some((approval) => approval.role === user.role);
    if (!isOwner && !isApprover) {
        throw (0, httpErrors_1.forbidden)('You do not have access to this travel request');
    }
    return request;
};
exports.getRequestById = getRequestById;
const getCurrentApprovalStep = (request) => {
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
const decideOnRequest = async ({ requestId, user, decision, comments, }) => {
    const request = await (0, exports.getRequestById)(requestId, user);
    const currentStep = getCurrentApprovalStep(request);
    if (!currentStep) {
        throw (0, httpErrors_1.badRequest)('This travel request has already completed its approval workflow');
    }
    const { entry: current, index } = currentStep;
    if (current.role !== user.role) {
        throw (0, httpErrors_1.forbidden)('You are not authorized to act on this approval step');
    }
    if (current.status !== enums_1.ApprovalStatus.PENDING) {
        throw (0, httpErrors_1.badRequest)('This approval step has already been completed');
    }
    current.status = decision === 'APPROVE' ? enums_1.ApprovalStatus.APPROVED : enums_1.ApprovalStatus.REJECTED;
    current.decidedAt = new Date();
    const approverId = ensureObjectId(user._id);
    const hasComment = typeof comments === 'string' && comments.trim().length > 0;
    if ('set' in current && typeof current.set === 'function') {
        const update = { approver: approverId };
        if (hasComment) {
            update.comments = comments;
        }
        else {
            update.comments = undefined;
        }
        current.set(update);
    }
    else {
        if (hasComment) {
            current.comments = comments;
        }
        else if ('comments' in current) {
            delete current.comments;
        }
        current.approver = approverId;
    }
    request.status = calculateRequestStatus(current.role, current.status);
    if (current.status === enums_1.ApprovalStatus.APPROVED) {
        request.currentApprovalIndex = index + 1;
        if (request.currentApprovalIndex >= request.approvals.length) {
            request.currentApprovalIndex = -1;
        }
    }
    else {
        request.currentApprovalIndex = -1;
    }
    await request.save();
    if (current.status === enums_1.ApprovalStatus.APPROVED) {
        const nextStep = getCurrentApprovalStep(request);
        if (nextStep) {
            await notifyApprovers([nextStep.entry.role], request);
        }
        else {
            await notifyRequester(request, `Your travel request ${request.requestNumber} has been fully approved.`);
        }
    }
    else {
        await notifyRequester(request, `Your travel request ${request.requestNumber} was rejected by ${user.name}.`);
    }
    return request;
};
exports.decideOnRequest = decideOnRequest;
//# sourceMappingURL=requestService.js.map
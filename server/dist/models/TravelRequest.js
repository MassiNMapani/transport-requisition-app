"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelRequestModel = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("./enums");
const travelerSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    numberOfDays: { type: Number, required: true, min: 0 },
    perDiemRate: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
}, { _id: false });
const approvalSchema = new mongoose_1.Schema({
    role: { type: String, enum: Object.values(enums_1.UserRole), required: true },
    approver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: Object.values(enums_1.ApprovalStatus), default: enums_1.ApprovalStatus.PENDING },
    decidedAt: { type: Date },
    comments: { type: String, trim: true },
}, { _id: false });
const travelRequestSchema = new mongoose_1.Schema({
    requestNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    requester: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
        enum: Object.values(enums_1.RequestStatus),
        default: enums_1.RequestStatus.SUBMITTED,
    },
    approvals: { type: [approvalSchema], default: [] },
    currentApprovalIndex: { type: Number, default: 0 },
}, { timestamps: true });
exports.TravelRequestModel = (0, mongoose_1.model)('TravelRequest', travelRequestSchema);
//# sourceMappingURL=TravelRequest.js.map
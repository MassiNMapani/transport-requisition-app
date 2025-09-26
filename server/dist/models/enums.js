"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestStatus = exports.ApprovalStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["REQUESTOR"] = "REQUESTOR";
    UserRole["HEAD_OF_DEPARTMENT"] = "HEAD_OF_DEPARTMENT";
    UserRole["HEAD_HR_ADMIN"] = "HEAD_HR_ADMIN";
    UserRole["CHIEF_EXECUTIVE_OFFICER"] = "CHIEF_EXECUTIVE_OFFICER";
    UserRole["CHAIRMAN"] = "CHAIRMAN";
})(UserRole || (exports.UserRole = UserRole = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["DRAFT"] = "DRAFT";
    RequestStatus["SUBMITTED"] = "SUBMITTED";
    RequestStatus["HOD_APPROVED"] = "HOD_APPROVED";
    RequestStatus["HOD_REJECTED"] = "HOD_REJECTED";
    RequestStatus["HR_APPROVED"] = "HR_APPROVED";
    RequestStatus["HR_REJECTED"] = "HR_REJECTED";
    RequestStatus["CEO_APPROVED"] = "CEO_APPROVED";
    RequestStatus["CEO_REJECTED"] = "CEO_REJECTED";
    RequestStatus["CHAIRMAN_APPROVED"] = "CHAIRMAN_APPROVED";
    RequestStatus["CHAIRMAN_REJECTED"] = "CHAIRMAN_REJECTED";
    RequestStatus["COMPLETED"] = "COMPLETED";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
//# sourceMappingURL=enums.js.map
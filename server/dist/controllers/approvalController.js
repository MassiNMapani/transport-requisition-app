"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitApprovalDecision = exports.getPendingApprovals = void 0;
const requestService_1 = require("../services/requestService");
const httpErrors_1 = require("../utils/httpErrors");
const getPendingApprovals = async (req, res, next) => {
    try {
        const user = req.currentUser;
        if (!user) {
            throw (0, httpErrors_1.badRequest)('Unable to identify current user');
        }
        const pending = await (0, requestService_1.listPendingApprovals)(user);
        res.json(pending);
    }
    catch (error) {
        next(error);
    }
};
exports.getPendingApprovals = getPendingApprovals;
const submitApprovalDecision = async (req, res, next) => {
    try {
        const user = req.currentUser;
        if (!user) {
            throw (0, httpErrors_1.badRequest)('Unable to identify current user');
        }
        const { id } = req.params;
        if (!id) {
            throw (0, httpErrors_1.badRequest)('Request identifier is required');
        }
        const { decision, comments } = req.body;
        if (!decision || !['APPROVE', 'REJECT'].includes(decision)) {
            throw (0, httpErrors_1.badRequest)('Decision must be APPROVE or REJECT');
        }
        const updated = await (0, requestService_1.decideOnRequest)({
            requestId: id,
            user,
            decision,
            comments,
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
};
exports.submitApprovalDecision = submitApprovalDecision;
//# sourceMappingURL=approvalController.js.map
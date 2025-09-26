"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const approvalController_1 = require("../controllers/approvalController");
const router = (0, express_1.Router)();
exports.approvalRouter = router;
router.use(authenticate_1.authenticate);
router.get('/pending', approvalController_1.getPendingApprovals);
router.post('/:id/decision', approvalController_1.submitApprovalDecision);
//# sourceMappingURL=approvalRoutes.js.map
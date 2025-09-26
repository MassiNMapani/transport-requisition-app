"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const requestController_1 = require("../controllers/requestController");
const router = (0, express_1.Router)();
exports.requestRouter = router;
router.use(authenticate_1.authenticate);
router.post('/', requestController_1.createRequest);
router.get('/', requestController_1.getMyRequests);
router.get('/:id', requestController_1.getRequest);
//# sourceMappingURL=requestRoutes.js.map
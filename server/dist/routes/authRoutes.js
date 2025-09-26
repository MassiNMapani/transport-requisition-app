"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
//# sourceMappingURL=authRoutes.js.map
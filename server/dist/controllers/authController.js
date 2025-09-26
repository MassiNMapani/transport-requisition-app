"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const zod_1 = require("zod");
const authService_1 = require("../services/authService");
const httpErrors_1 = require("../utils/httpErrors");
const register = async (req, res, next) => {
    try {
        const user = await (0, authService_1.registerUser)(req.body);
        res.status(201).json({ user: (0, authService_1.toPublicUser)(user) });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return next((0, httpErrors_1.badRequest)('Invalid data provided', error.flatten()));
        }
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { user, token } = await (0, authService_1.authenticateUser)(req.body);
        res.json({ token, user: (0, authService_1.toPublicUser)(user) });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return next((0, httpErrors_1.badRequest)('Invalid data provided', error.flatten()));
        }
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map
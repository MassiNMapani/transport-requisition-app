"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const tokenService_1 = require("../services/tokenService");
const User_1 = require("../models/User");
const httpErrors_1 = require("../utils/httpErrors");
const authenticate = async (req, _res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            throw (0, httpErrors_1.unauthorized)();
        }
        const [scheme, token] = header.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw (0, httpErrors_1.unauthorized)();
        }
        const payload = (0, tokenService_1.verifyAuthToken)(token);
        const user = await User_1.UserModel.findById(payload.sub);
        if (!user || !user.active) {
            throw (0, httpErrors_1.unauthorized)();
        }
        req.currentUser = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, _res, next) => {
        const user = req.currentUser;
        if (!user) {
            return next((0, httpErrors_1.unauthorized)());
        }
        if (!roles.includes(user.role)) {
            return next((0, httpErrors_1.forbidden)());
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authenticate.js.map
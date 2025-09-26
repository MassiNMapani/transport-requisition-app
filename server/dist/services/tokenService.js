"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = exports.createAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const parseExpiresIn = (value) => {
    if (!value) {
        return undefined;
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
        return numeric;
    }
    return value;
};
const createAuthToken = (user) => {
    const payload = {
        sub: user.id,
        role: user.role,
        employeeId: user.employeeId,
        name: user.name,
    };
    const options = {};
    const expiresIn = parseExpiresIn(env_1.env.jwtExpiresIn);
    if (expiresIn !== undefined) {
        options.expiresIn = expiresIn;
    }
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, options);
};
exports.createAuthToken = createAuthToken;
const verifyAuthToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
};
exports.verifyAuthToken = verifyAuthToken;
//# sourceMappingURL=tokenService.js.map
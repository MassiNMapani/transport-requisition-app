"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicUser = exports.authenticateUser = exports.registerUser = void 0;
const zod_1 = require("zod");
const User_1 = require("../models/User");
const enums_1 = require("../models/enums");
const password_1 = require("../utils/password");
const tokenService_1 = require("./tokenService");
const registerSchema = zod_1.z.object({
    employeeId: zod_1.z.string().min(3).max(20),
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    department: zod_1.z.string().min(1).optional(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.nativeEnum(enums_1.UserRole),
});
const registerUser = async (input) => {
    const data = registerSchema.parse(input);
    const existing = await User_1.UserModel.findOne({ employeeId: data.employeeId.toUpperCase() });
    if (existing) {
        throw new Error('Employee ID already registered');
    }
    const passwordHash = await (0, password_1.hashPassword)(data.password);
    const user = new User_1.UserModel({
        employeeId: data.employeeId.toUpperCase(),
        name: data.name,
        email: data.email,
        department: data.department,
        passwordHash,
        role: data.role,
    });
    await user.save();
    return user;
};
exports.registerUser = registerUser;
const loginSchema = zod_1.z.object({
    employeeId: zod_1.z.string().min(3),
    password: zod_1.z.string().min(1),
});
const authenticateUser = async (input) => {
    const data = loginSchema.parse(input);
    const employeeId = data.employeeId.toUpperCase();
    const user = await User_1.UserModel.findOne({ employeeId, active: true });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const passwordValid = await (0, password_1.verifyPassword)(data.password, user.passwordHash);
    if (!passwordValid) {
        throw new Error('Invalid credentials');
    }
    const token = (0, tokenService_1.createAuthToken)(user);
    return { user, token };
};
exports.authenticateUser = authenticateUser;
const toPublicUser = (user) => ({
    id: user.id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role,
    active: user.active,
});
exports.toPublicUser = toPublicUser;
//# sourceMappingURL=authService.js.map
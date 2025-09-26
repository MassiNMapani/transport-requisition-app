"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("./enums");
const userSchema = new mongoose_1.Schema({
    employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    department: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(enums_1.UserRole),
        required: true,
        default: enums_1.UserRole.REQUESTOR,
    },
    active: { type: Boolean, default: true },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map
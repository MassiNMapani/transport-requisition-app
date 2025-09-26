"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const toNumber = (value, fallback) => {
    if (!value)
        return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};
exports.env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: toNumber(process.env.PORT, 4000),
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/transport_requisition',
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
    emailFrom: process.env.EMAIL_FROM || 'no-reply@example.com',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: toNumber(process.env.SMTP_PORT, 587),
    smtpUser: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASSWORD || '',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
//# sourceMappingURL=env.js.map
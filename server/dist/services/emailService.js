"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
let transporter = null;
const ensureTransporter = () => {
    if (transporter) {
        return transporter;
    }
    if (!env_1.env.smtpHost || !env_1.env.smtpUser || !env_1.env.smtpPassword) {
        logger_1.logger.info('Email transport not configured; emails will be logged');
        return null;
    }
    transporter = nodemailer_1.default.createTransport({
        host: env_1.env.smtpHost,
        port: env_1.env.smtpPort,
        secure: env_1.env.smtpPort === 465,
        auth: {
            user: env_1.env.smtpUser,
            pass: env_1.env.smtpPassword,
        },
    });
    return transporter;
};
const sendEmail = async ({ to, subject, text }) => {
    const activeTransporter = ensureTransporter();
    if (!activeTransporter) {
        logger_1.logger.info('Mock email', { to, subject, text });
        return;
    }
    await activeTransporter.sendMail({
        from: env_1.env.emailFrom,
        to,
        subject,
        text,
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailService.js.map
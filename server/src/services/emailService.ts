import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

let transporter: nodemailer.Transporter | null = null;

const ensureTransporter = () => {
  if (transporter) {
    return transporter;
  }
  if (!env.smtpHost || !env.smtpUser || !env.smtpPassword) {
    logger.info('Email transport not configured; emails will be logged');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPassword,
    },
  });
  return transporter;
};

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async ({ to, subject, text }: EmailPayload) => {
  const activeTransporter = ensureTransporter();
  if (!activeTransporter) {
    logger.info('Mock email', { to, subject, text });
    return;
  }

  await activeTransporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
  });
};

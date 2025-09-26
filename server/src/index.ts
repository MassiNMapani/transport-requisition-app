import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/authRoutes';
import { requestRouter } from './routes/requestRoutes';
import { approvalRouter } from './routes/approvalRoutes';

const app = express();
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/requests', requestRouter);
app.use('/api/approvals', approvalRouter);

app.use(errorHandler);

const start = async () => {
  await connectDatabase();
  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};

start().catch((error) => {
  logger.error('App failed to start', { error });
  process.exit(1);
});

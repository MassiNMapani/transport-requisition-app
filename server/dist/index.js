"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = require("./routes/authRoutes");
const requestRoutes_1 = require("./routes/requestRoutes");
const approvalRoutes_1 = require("./routes/approvalRoutes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.env.frontendUrl, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes_1.authRouter);
app.use('/api/requests', requestRoutes_1.requestRouter);
app.use('/api/approvals', approvalRoutes_1.approvalRouter);
app.use(errorHandler_1.errorHandler);
const start = async () => {
    await (0, database_1.connectDatabase)();
    app.listen(env_1.env.port, () => {
        logger_1.logger.info(`Server running on port ${env_1.env.port}`);
    });
};
start().catch((error) => {
    logger_1.logger.error('App failed to start', { error });
    process.exit(1);
});
//# sourceMappingURL=index.js.map
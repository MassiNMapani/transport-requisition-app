"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const httpErrors_1 = require("../utils/httpErrors");
const logger_1 = require("../utils/logger");
// Centralized error handler to normalize API error responses
const errorHandler = (err, _req, res, _next) => {
    const isAppError = err instanceof httpErrors_1.AppError;
    const status = isAppError ? err.statusCode : 500;
    const message = isAppError ? err.message : 'Internal Server Error';
    if (!isAppError) {
        logger_1.logger.error('Unhandled error', { err });
    }
    res.status(status).json({
        message,
        ...(isAppError && err.details ? { details: err.details } : {}),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map
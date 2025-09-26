"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.forbidden = exports.unauthorized = exports.badRequest = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 400, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
const badRequest = (message, details) => new AppError(message, 400, details);
exports.badRequest = badRequest;
const unauthorized = (message = 'Unauthorized') => new AppError(message, 401);
exports.unauthorized = unauthorized;
const forbidden = (message = 'Forbidden') => new AppError(message, 403);
exports.forbidden = forbidden;
const notFound = (message = 'Not Found') => new AppError(message, 404);
exports.notFound = notFound;
//# sourceMappingURL=httpErrors.js.map
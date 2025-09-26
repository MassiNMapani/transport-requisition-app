"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
const connectDatabase = async () => {
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(env_1.env.mongoUri);
        logger_1.logger.info('Connected to MongoDB');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to MongoDB', { error });
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map
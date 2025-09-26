"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
/* Simple console-based logger to allow structured messages */
exports.logger = {
    info: (message, meta) => {
        console.log(JSON.stringify({ level: 'info', message, ...(meta || {}) }));
    },
    error: (message, meta) => {
        console.error(JSON.stringify({ level: 'error', message, ...(meta || {}) }));
    },
};
//# sourceMappingURL=logger.js.map
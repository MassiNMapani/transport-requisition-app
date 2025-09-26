"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRequestNumber = void 0;
const pad = (value) => value.toString().padStart(2, '0');
const generateRequestNumber = () => {
    const now = new Date();
    const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const randomPart = Math.floor(Math.random() * 9000 + 1000);
    return `TR-${datePart}-${randomPart}`;
};
exports.generateRequestNumber = generateRequestNumber;
//# sourceMappingURL=requestNumber.js.map
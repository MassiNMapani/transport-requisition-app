"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequest = exports.getMyRequests = exports.createRequest = void 0;
const zod_1 = require("zod");
const requestService_1 = require("../services/requestService");
const httpErrors_1 = require("../utils/httpErrors");
const createRequest = async (req, res, next) => {
    try {
        const user = req.currentUser;
        if (!user) {
            throw (0, httpErrors_1.badRequest)('Unable to identify current user');
        }
        const requestDoc = await (0, requestService_1.createTravelRequest)(req.body, user);
        res.status(201).json(requestDoc);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return next((0, httpErrors_1.badRequest)('Invalid data provided', error.flatten()));
        }
        next(error);
    }
};
exports.createRequest = createRequest;
const getMyRequests = async (req, res, next) => {
    try {
        const user = req.currentUser;
        if (!user) {
            throw (0, httpErrors_1.badRequest)('Unable to identify current user');
        }
        const requests = await (0, requestService_1.listRequestsForUser)(user);
        res.json(requests);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyRequests = getMyRequests;
const getRequest = async (req, res, next) => {
    try {
        const user = req.currentUser;
        if (!user) {
            throw (0, httpErrors_1.badRequest)('Unable to identify current user');
        }
        const { id } = req.params;
        if (!id) {
            throw (0, httpErrors_1.badRequest)('Request identifier is required');
        }
        const requestDoc = await (0, requestService_1.getRequestById)(id, user);
        res.json(requestDoc);
    }
    catch (error) {
        next(error);
    }
};
exports.getRequest = getRequest;
//# sourceMappingURL=requestController.js.map
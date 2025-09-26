import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  createTravelRequest,
  listRequestsForUser,
  getRequestById,
} from '../services/requestService';
import { badRequest } from '../utils/httpErrors';

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.currentUser;
    if (!user) {
      throw badRequest('Unable to identify current user');
    }
    const requestDoc = await createTravelRequest(req.body, user);
    res.status(201).json(requestDoc);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(badRequest('Invalid data provided', error.flatten()));
    }
    next(error);
  }
};

export const getMyRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.currentUser;
    if (!user) {
      throw badRequest('Unable to identify current user');
    }
    const requests = await listRequestsForUser(user);
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const getRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.currentUser;
    if (!user) {
      throw badRequest('Unable to identify current user');
    }
    const { id } = req.params;
    if (!id) {
      throw badRequest('Request identifier is required');
    }
    const requestDoc = await getRequestById(id, user);
    res.json(requestDoc);
  } catch (error) {
    next(error);
  }
};

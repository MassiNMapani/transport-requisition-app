import { Request, Response, NextFunction } from 'express';
import { listPendingApprovals, decideOnRequest } from '../services/requestService';
import { badRequest } from '../utils/httpErrors';

export const getPendingApprovals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser;
    if (!user) {
      throw badRequest('Unable to identify current user');
    }
    const pending = await listPendingApprovals(user);
    res.json(pending);
  } catch (error) {
    next(error);
  }
};

export const submitApprovalDecision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser;
    if (!user) {
      throw badRequest('Unable to identify current user');
    }
    const { id } = req.params;
    if (!id) {
      throw badRequest('Request identifier is required');
    }
    const { decision, comments } = req.body;
    if (!decision || !['APPROVE', 'REJECT'].includes(decision)) {
      throw badRequest('Decision must be APPROVE or REJECT');
    }
    const updated = await decideOnRequest({
      requestId: id,
      user,
      decision,
      comments,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

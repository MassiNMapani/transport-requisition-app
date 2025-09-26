import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { getPendingApprovals, submitApprovalDecision } from '../controllers/approvalController';

const router = Router();

router.use(authenticate);
router.get('/pending', getPendingApprovals);
router.post('/:id/decision', submitApprovalDecision);

export { router as approvalRouter };

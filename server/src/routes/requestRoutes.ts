import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { createRequest, getMyRequests, getRequest } from '../controllers/requestController';

const router = Router();

router.use(authenticate);
router.post('/', createRequest);
router.get('/', getMyRequests);
router.get('/:id', getRequest);

export { router as requestRouter };

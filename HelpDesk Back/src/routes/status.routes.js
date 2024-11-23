import { Router } from 'express';
import StatusController from '../controllers/status.controller.js';
import authenticateToken from '../middlewares/auth.js';
import statusController from '../controllers/status.controller.js';

const router = Router();

router.get('/status', authenticateToken, StatusController.getAllStatuses);

router.get(
    '/tickets/:friendlyCode/status-history',
    authenticateToken,
    (req, res, next) => {
        StatusController.getStatusHistoryByFriendlyCode(req, res, next);
    }
);
export default router;

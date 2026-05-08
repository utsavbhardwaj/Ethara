import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate as any);
router.get('/stats', (req, res, next) => dashboardController.getStats(req as any, res, next));

export default router;

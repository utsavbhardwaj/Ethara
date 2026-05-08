import { Router } from 'express';
import { projectsController } from './projects.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/rbac.middleware';

const router = Router();

router.use(authenticate as any);

router.get('/', (req, res, next) => projectsController.getAll(req as any, res, next));
router.post('/', requireAdmin as any, (req, res, next) => projectsController.create(req as any, res, next));
router.get('/users', (req, res, next) => projectsController.getAllUsers(req as any, res, next));
router.get('/:id', (req, res, next) => projectsController.getById(req as any, res, next));
router.put('/:id', (req, res, next) => projectsController.update(req as any, res, next));
router.delete('/:id', requireAdmin as any, (req, res, next) => projectsController.delete(req as any, res, next));
router.post('/:id/members', requireAdmin as any, (req, res, next) => projectsController.addMember(req as any, res, next));
router.delete('/:id/members/:userId', requireAdmin as any, (req, res, next) => projectsController.removeMember(req as any, res, next));

export default router;

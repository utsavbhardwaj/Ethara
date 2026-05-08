import { Router } from 'express';
import { tasksController } from './tasks.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate as any);

router.get('/', (req, res, next) => tasksController.getAll(req as any, res, next));
router.post('/', (req, res, next) => tasksController.create(req as any, res, next));
router.get('/:id', (req, res, next) => tasksController.getById(req as any, res, next));
router.put('/:id', (req, res, next) => tasksController.update(req as any, res, next));
router.delete('/:id', (req, res, next) => tasksController.delete(req as any, res, next));

export default router;

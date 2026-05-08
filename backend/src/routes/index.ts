import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import projectsRoutes from '../modules/projects/projects.routes';
import tasksRoutes from '../modules/tasks/tasks.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

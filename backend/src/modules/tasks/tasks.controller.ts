import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { tasksService } from './tasks.service';
import { createTaskSchema, updateTaskSchema } from './tasks.dto';
import { sendSuccess } from '../../utils/response.utils';
import { AppError } from '../../middleware/error.middleware';

export class TasksController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const projectId = req.query.projectId as string | undefined;
      const tasks = await tasksService.getAll(req.user.id, req.user.role, projectId);
      sendSuccess(res, tasks);
    } catch (err) { next(err); }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const task = await tasksService.getById(req.params.id, req.user.id, req.user.role);
      sendSuccess(res, task);
    } catch (err) { next(err); }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const dto = createTaskSchema.parse(req.body);
      const task = await tasksService.create(dto, req.user.id);
      sendSuccess(res, task, 'Task created', 201);
    } catch (err) { next(err); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const dto = updateTaskSchema.parse(req.body);
      const task = await tasksService.update(req.params.id, dto, req.user.id, req.user.role);
      sendSuccess(res, task, 'Task updated');
    } catch (err) { next(err); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      await tasksService.delete(req.params.id, req.user.id, req.user.role);
      sendSuccess(res, null, 'Task deleted');
    } catch (err) { next(err); }
  }
}

export const tasksController = new TasksController();

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { projectsService } from './projects.service';
import { createProjectSchema, updateProjectSchema, addMemberSchema } from './projects.dto';
import { sendSuccess } from '../../utils/response.utils';
import { AppError } from '../../middleware/error.middleware';

export class ProjectsController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const projects = await projectsService.getAll(req.user.id, req.user.role);
      sendSuccess(res, projects);
    } catch (err) { next(err); }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const project = await projectsService.getById(req.params.id, req.user.id, req.user.role);
      sendSuccess(res, project);
    } catch (err) { next(err); }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const dto = createProjectSchema.parse(req.body);
      const project = await projectsService.create(dto, req.user.id);
      sendSuccess(res, project, 'Project created', 201);
    } catch (err) { next(err); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const dto = updateProjectSchema.parse(req.body);
      const project = await projectsService.update(req.params.id, dto, req.user.id, req.user.role);
      sendSuccess(res, project, 'Project updated');
    } catch (err) { next(err); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      await projectsService.delete(req.params.id, req.user.id, req.user.role);
      sendSuccess(res, null, 'Project deleted');
    } catch (err) { next(err); }
  }

  async addMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const dto = addMemberSchema.parse(req.body);
      const member = await projectsService.addMember(req.params.id, dto, req.user.id);
      sendSuccess(res, member, 'Member added', 201);
    } catch (err) { next(err); }
  }

  async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      await projectsService.removeMember(req.params.id, req.params.userId, req.user.id);
      sendSuccess(res, null, 'Member removed');
    } catch (err) { next(err); }
  }

  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await projectsService.getAllUsers();
      sendSuccess(res, users);
    } catch (err) { next(err); }
  }
}

export const projectsController = new ProjectsController();

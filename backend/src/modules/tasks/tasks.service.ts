import prisma from '../../prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { CreateTaskDTO, UpdateTaskDTO } from './tasks.dto';
import { activityService } from '../activity/activity.service';

export class TasksService {
  async getAll(userId: string, userRole: string, projectId?: string) {
    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
    } else if (userRole !== 'ADMIN') {
      where.project = {
        members: { some: { userId } },
      };
    }

    return prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        project: { select: { id: true, title: true } },
      },
      orderBy: [{ status: 'asc' }, { position: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getById(taskId: string, userId: string, userRole: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        project: {
          include: {
            members: { select: { userId: true } },
          },
        },
      },
    });

    if (!task) throw new AppError('Task not found', 404);

    if (userRole !== 'ADMIN') {
      const isMember = task.project.members.some((m) => m.userId === userId);
      if (!isMember) throw new AppError('Access denied', 403);
    }

    return task;
  }

  async create(dto: CreateTaskDTO, userId: string) {
    const project = await prisma.project.findUnique({ where: { id: dto.projectId } });
    if (!project) throw new AppError('Project not found', 404);

    // Get position: count existing tasks in same status
    const count = await prisma.task.count({
      where: { projectId: dto.projectId, status: dto.status || 'TODO' },
    });

    const task = await prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        assignedTo: dto.assignedTo || null,
        projectId: dto.projectId,
        position: dto.position ?? count,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    await activityService.log({
      action: `Created task "${task.title}"`,
      entityType: 'TASK',
      entityId: task.id,
      performedBy: userId,
      projectId: dto.projectId,
    });

    return task;
  }

  async update(taskId: string, dto: UpdateTaskDTO, userId: string, userRole: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { members: { select: { userId: true } } } } },
    });

    if (!task) throw new AppError('Task not found', 404);

    if (userRole !== 'ADMIN') {
      const isMember = task.project.members.some((m) => m.userId === userId);
      if (!isMember) throw new AppError('Access denied', 403);
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : dto.dueDate === null ? null : undefined,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        project: { select: { id: true, title: true } },
      },
    });

    if (dto.status && dto.status !== task.status) {
      await activityService.log({
        action: `Moved task "${task.title}" to ${dto.status.replace('_', ' ')}`,
        entityType: 'TASK',
        entityId: taskId,
        performedBy: userId,
        projectId: task.projectId,
      });
    }

    return updated;
  }

  async delete(taskId: string, userId: string, userRole: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { members: { select: { userId: true } } } } },
    });

    if (!task) throw new AppError('Task not found', 404);

    if (userRole !== 'ADMIN') {
      const isMember = task.project.members.some((m) => m.userId === userId);
      if (!isMember) throw new AppError('Access denied', 403);
    }

    await prisma.task.delete({ where: { id: taskId } });

    await activityService.log({
      action: `Deleted task "${task.title}"`,
      entityType: 'TASK',
      entityId: taskId,
      performedBy: userId,
      projectId: task.projectId,
    });
  }
}

export const tasksService = new TasksService();

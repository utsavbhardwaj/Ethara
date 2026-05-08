import prisma from '../../prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { CreateProjectDTO, UpdateProjectDTO, AddMemberDTO } from './projects.dto';
import { activityService } from '../activity/activity.service';

export class ProjectsService {
  async getAll(userId: string, userRole: string) {
    const where =
      userRole === 'ADMIN'
        ? {}
        : {
            members: {
              some: { userId },
            },
          };

    const projects = await prisma.project.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, email: true, avatar: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects;
  }

  async getById(projectId: string, userId: string, userRole: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        creator: { select: { id: true, name: true, email: true, avatar: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
          },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true, avatar: true } },
          },
          orderBy: { position: 'asc' },
        },
        _count: { select: { tasks: true, members: true } },
      },
    });

    if (!project) throw new AppError('Project not found', 404);

    if (userRole !== 'ADMIN') {
      const isMember = project.members.some((m) => m.userId === userId);
      if (!isMember) throw new AppError('Access denied', 403);
    }

    return project;
  }

  async create(dto: CreateProjectDTO, userId: string) {
    const project = await prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        status: dto.status || 'ACTIVE',
        createdBy: userId,
        members: {
          create: { userId, role: 'ADMIN' },
        },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    await activityService.log({
      action: `Created project "${project.title}"`,
      entityType: 'PROJECT',
      entityId: project.id,
      performedBy: userId,
      projectId: project.id,
    });

    return project;
  }

  async update(projectId: string, dto: UpdateProjectDTO, userId: string, userRole: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError('Project not found', 404);

    if (userRole !== 'ADMIN' && project.createdBy !== userId) {
      throw new AppError('Not authorized to update this project', 403);
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...dto,
        deadline: dto.deadline ? new Date(dto.deadline) : dto.deadline === null ? null : undefined,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    await activityService.log({
      action: `Updated project "${updated.title}"`,
      entityType: 'PROJECT',
      entityId: projectId,
      performedBy: userId,
      projectId,
    });

    return updated;
  }

  async delete(projectId: string, userId: string, userRole: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError('Project not found', 404);

    if (userRole !== 'ADMIN' && project.createdBy !== userId) {
      throw new AppError('Not authorized to delete this project', 403);
    }

    await prisma.project.delete({ where: { id: projectId } });
  }

  async addMember(projectId: string, dto: AddMemberDTO, requesterId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError('Project not found', 404);

    const user = await prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new AppError('User not found', 404);

    const existing = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: dto.userId, projectId } },
    });
    if (existing) throw new AppError('User is already a member', 409);

    const member = await prisma.projectMember.create({
      data: { userId: dto.userId, projectId, role: dto.role || 'MEMBER' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    await activityService.log({
      action: `Added ${user.name} to project`,
      entityType: 'PROJECT_MEMBER',
      entityId: projectId,
      performedBy: requesterId,
      projectId,
    });

    return member;
  }

  async removeMember(projectId: string, userId: string, requesterId: string) {
    const member = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
      include: { user: { select: { name: true } } },
    });
    if (!member) throw new AppError('Member not found', 404);

    await prisma.projectMember.delete({
      where: { userId_projectId: { userId, projectId } },
    });

    await activityService.log({
      action: `Removed ${member.user.name} from project`,
      entityType: 'PROJECT_MEMBER',
      entityId: projectId,
      performedBy: requesterId,
      projectId,
    });
  }

  async getAllUsers() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, avatar: true },
      orderBy: { name: 'asc' },
    });
  }
}

export const projectsService = new ProjectsService();

import prisma from '../../prisma/client';

interface LogActivityParams {
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  projectId?: string;
  metadata?: Record<string, unknown>;
}

export class ActivityService {
  async log(params: LogActivityParams) {
    return prisma.activityLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        performedBy: params.performedBy,
        projectId: params.projectId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: params.metadata as any,
      },
    });
  }

  async getForProject(projectId: string, limit = 20) {
    return prisma.activityLog.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRecent(userId: string, userRole: string, limit = 20) {
    const where =
      userRole === 'ADMIN'
        ? {}
        : {
            project: {
              members: { some: { userId } },
            },
          };

    return prisma.activityLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        project: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const activityService = new ActivityService();

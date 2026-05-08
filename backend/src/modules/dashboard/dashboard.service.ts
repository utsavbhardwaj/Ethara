import prisma from '../../prisma/client';
import { activityService } from '../activity/activity.service';

export class DashboardService {
  async getStats(userId: string, userRole: string) {
    const now = new Date();
    const projectWhere =
      userRole === 'ADMIN'
        ? {}
        : { members: { some: { userId } } };

    const taskWhere =
      userRole === 'ADMIN'
        ? {}
        : { project: { members: { some: { userId } } } };

    const [
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      reviewTasks,
      todoTasks,
      overdueTasks,
      myTasks,
      recentActivity,
      projectsByStatus,
      tasksByPriority,
    ] = await Promise.all([
      prisma.project.count({ where: projectWhere }),
      prisma.task.count({ where: taskWhere }),
      prisma.task.count({ where: { ...taskWhere, status: 'COMPLETED' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'REVIEW' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'TODO' } }),
      prisma.task.count({
        where: {
          ...taskWhere,
          dueDate: { lt: now },
          status: { not: 'COMPLETED' },
        },
      }),
      prisma.task.findMany({
        where: { assignedTo: userId, status: { not: 'COMPLETED' } },
        include: {
          project: { select: { id: true, title: true } },
          assignee: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),
      activityService.getRecent(userId, userRole, 10),
      prisma.project.groupBy({
        by: ['status'],
        where: projectWhere,
        _count: { status: true },
      }),
      prisma.task.groupBy({
        by: ['priority'],
        where: taskWhere,
        _count: { priority: true },
      }),
    ]);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      reviewTasks,
      todoTasks,
      overdueTasks,
      completionRate,
      myTasks,
      recentActivity,
      projectsByStatus,
      tasksByPriority,
    };
  }
}

export const dashboardService = new DashboardService();

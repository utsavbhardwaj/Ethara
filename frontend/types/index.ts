export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  avatar?: string | null;
  createdAt: string;
  _count?: {
    projectsCreated: number;
    tasksAssigned: number;
  };
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  deadline?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creator: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
  members: ProjectMember[];
  tasks?: Task[];
  _count?: {
    tasks: number;
    members?: number;
  };
}

export interface ProjectMember {
  id: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar' | 'role'>;
  projectId: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string | null;
  assignee?: Pick<User, 'id' | 'name' | 'email' | 'avatar'> | null;
  projectId: string;
  project?: Pick<Project, 'id' | 'title'>;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  performedBy: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
  project?: Pick<Project, 'id' | 'title'> | null;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  todoTasks: number;
  overdueTasks: number;
  completionRate: number;
  myTasks: Task[];
  recentActivity: ActivityLog[];
  projectsByStatus: Array<{ status: string; _count: { status: number } }>;
  tasksByPriority: Array<{ priority: string; _count: { priority: number } }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

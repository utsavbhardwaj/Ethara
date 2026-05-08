import api from '@/lib/api';
import { Project, Task, DashboardStats, User, ApiResponse } from '@/types';

// Auth
export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { email, password }),
  signup: (name: string, email: string, password: string, role?: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/signup', { name, email, password, role }),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};

// Projects
export const projectsService = {
  getAll: () => api.get<ApiResponse<Project[]>>('/projects'),
  getById: (id: string) => api.get<ApiResponse<Project>>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<ApiResponse<Project>>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put<ApiResponse<Project>>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  addMember: (projectId: string, userId: string, role?: string) =>
    api.post(`/projects/${projectId}/members`, { userId, role }),
  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
  getAllUsers: () => api.get<ApiResponse<User[]>>('/projects/users'),
};

// Tasks
export const tasksService = {
  getAll: (projectId?: string) =>
    api.get<ApiResponse<Task[]>>('/tasks', { params: projectId ? { projectId } : {} }),
  getById: (id: string) => api.get<ApiResponse<Task>>(`/tasks/${id}`),
  create: (data: Partial<Task> & { projectId: string }) =>
    api.post<ApiResponse<Task>>('/tasks', data),
  update: (id: string, data: Partial<Task>) => api.put<ApiResponse<Task>>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Dashboard
export const dashboardService = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
};

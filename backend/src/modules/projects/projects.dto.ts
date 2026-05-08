import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  deadline: z.string().datetime().optional().nullable(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional().default('ACTIVE'),
});

export const updateProjectSchema = createProjectSchema.partial();

export const addMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['ADMIN', 'MEMBER']).optional().default('MEMBER'),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;
export type AddMemberDTO = z.infer<typeof addMemberSchema>;

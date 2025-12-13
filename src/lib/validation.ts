import { z } from 'zod';

// Task validation schemas
export const taskSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .trim()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  status: z.enum(['todo', 'in-progress', 'done', 'blocked']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  projectId: z.string().uuid('Invalid project ID'),
});

export const projectSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  description: z.string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;

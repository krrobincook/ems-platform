import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
    description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().transform((str) => new Date(str)).optional(),
    employeeId: z.string().length(24, 'Invalid employee ID').optional()
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Title cannot be empty').max(200, 'Title cannot exceed 200 characters').optional(),
    description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().transform((str) => new Date(str)).optional(),
    employeeId: z.string().length(24, 'Invalid employee ID').optional()
});

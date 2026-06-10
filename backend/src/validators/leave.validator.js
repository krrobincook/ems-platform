import { z } from 'zod';

export const createLeaveSchema = z.object({
    type: z.enum(['SICK_LEAVE', 'CASUAL_LEAVE', 'MATERNITY_LEAVE', 'UNPAID']),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    reason: z.string().min(5, 'Reason must be at least 5 characters long').max(500, 'Reason cannot exceed 500 characters')
});

export const updateLeaveStatusSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED'])
});

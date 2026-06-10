import { z } from 'zod';

export const attendanceSchema = z.object({
    employee: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid employee ID format'),
    date: z.string().transform((str) => new Date(str)).optional(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'LEAVE', 'HALF_DAY']).default('PRESENT'),
    checkIn: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)').optional(),
    checkOut: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)').optional(),
    remarks: z.string().max(500, 'Remarks cannot exceed 500 characters').optional().trim()
});

export const updateAttendanceSchema = attendanceSchema.partial();

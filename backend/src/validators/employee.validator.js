import { z } from 'zod';

export const createEmployeeSchema = z.object({
    user: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format')
        .describe('MongoDB ObjectId for the associated User'),
    
    employeeId: z.string()
        .min(1, 'Employee ID is required')
        .max(50, 'Employee ID cannot exceed 50 characters')
        .trim(),
        
    department: z.string()
        .min(2, 'Department must be at least 2 characters long')
        .max(100, 'Department cannot exceed 100 characters')
        .trim(),
        
    designation: z.string()
        .min(2, 'Designation must be at least 2 characters long')
        .max(100, 'Designation cannot exceed 100 characters')
        .trim(),
        
    salary: z.number()
        .positive('Salary must be a positive number'),
        
    dateOfJoining: z.coerce.date({
        required_error: "Date of joining is required",
        invalid_type_error: "Invalid date format for Date of Joining",
    }),
    
    phoneNumber: z.string()
        .min(10, 'Phone number must be at least 10 characters long')
        .max(20, 'Phone number cannot exceed 20 characters')
        .trim()
        .optional(),
        
    address: z.string()
        .max(500, 'Address cannot exceed 500 characters')
        .trim()
        .optional()
});

// For updating, we might not want them to be able to change user reference or employeeId
export const updateEmployeeSchema = z.object({
    department: z.string()
        .min(2, 'Department must be at least 2 characters long')
        .max(100, 'Department cannot exceed 100 characters')
        .trim()
        .optional(),
        
    designation: z.string()
        .min(2, 'Designation must be at least 2 characters long')
        .max(100, 'Designation cannot exceed 100 characters')
        .trim()
        .optional(),
        
    salary: z.number()
        .positive('Salary must be a positive number')
        .optional(),
        
    phoneNumber: z.string()
        .min(10, 'Phone number must be at least 10 characters long')
        .max(20, 'Phone number cannot exceed 20 characters')
        .trim()
        .optional(),
        
    address: z.string()
        .max(500, 'Address cannot exceed 500 characters')
        .trim()
        .optional()
});

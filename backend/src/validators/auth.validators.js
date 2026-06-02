import { z } from 'zod';

// Validator for User Registration
export const registerSchema = z.object({
    firstName: z.string()
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name cannot exceed 50 characters')
        .trim(),
        
    lastName: z.string()
        .min(2, 'Last name must be at least 2 characters long')
        .max(50, 'Last name cannot exceed 50 characters')
        .trim(),
        
    email: z.string()
        .email('Invalid email address format')
        .trim()
        .toLowerCase(),
        
    password: z.string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password cannot exceed 100 characters'),

    role: z.enum(['EMPLOYEE', 'ADMIN', 'HR']).optional()
});

// Validator for User Login
export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address format')
        .trim()
        .toLowerCase(),
        
    password: z.string()
        .min(1, 'Password is required')
});


export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next(); 
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: error.errors.map((err) => ({
                field: err.path[0],
                message: err.message
            }))
        });
    }
};

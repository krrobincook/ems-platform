import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/employee.validator.js';
import { validate } from '../validators/auth.validators.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { getMyProfile } from '../controllers/employee.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', authorizeRoles('ADMIN'), validate(createEmployeeSchema), employeeController.createEmployee);

router.get('/', authorizeRoles('ADMIN', 'HR'), employeeController.getAllEmployees);

router.get('/user/:userId', authorizeRoles('ADMIN', 'HR'), employeeController.getEmployeeByUserId);

router.get('/:id', authorizeRoles('ADMIN', 'HR'), employeeController.getEmployeeById);

router.put('/:id', authorizeRoles('ADMIN'), validate(updateEmployeeSchema), employeeController.updateEmployee);

router.delete('/:id', authorizeRoles('ADMIN'), employeeController.deleteEmployee);

router.get('/profile/me', authenticate, getMyProfile);

export default router;

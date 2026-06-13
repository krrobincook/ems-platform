import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', authorizeRoles('ADMIN', 'HR'), taskController.createTask);
router.get('/', authorizeRoles('ADMIN', 'HR'), taskController.getAllTasks);
router.delete('/:id', authorizeRoles('ADMIN', 'HR'), taskController.deleteTask);

router.get('/my', authorizeRoles('EMPLOYEE', 'ADMIN', 'HR'), taskController.getMyTasks);
router.get('/:id', authorizeRoles('EMPLOYEE', 'ADMIN', 'HR'), taskController.getTaskById);
router.put('/:id', authorizeRoles('EMPLOYEE', 'ADMIN', 'HR'), taskController.updateTask);

export default router;
import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', authorizeRoles('ADMIN', 'MANAGER'), taskController.createTask);
router.get('/', authorizeRoles('ADMIN', 'MANAGER'), taskController.getAllTasks);
router.delete('/:id', authorizeRoles('ADMIN', 'MANAGER'), taskController.deleteTask);

router.get('/my', authorizeRoles('EMPLOYEE', 'ADMIN', 'MANAGER'), taskController.getMyTasks);
router.get('/:id', authorizeRoles('EMPLOYEE', 'ADMIN', 'MANAGER'), taskController.getTaskById);
router.put('/:id', authorizeRoles('EMPLOYEE', 'ADMIN', 'MANAGER'), taskController.updateTask);

export default router;

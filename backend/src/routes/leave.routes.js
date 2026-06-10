import { Router } from 'express';
import * as leaveController from '../controllers/leave.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', leaveController.applyLeave);
router.get('/my', leaveController.getMyLeaveSummary);

router.get('/', authorizeRoles('ADMIN', 'HR'), leaveController.getAllLeaves);
router.get('/employee/:employeeId', authorizeRoles('ADMIN', 'HR'), leaveController.getEmployeeLeaveSummary);
router.put('/:id/status', authorizeRoles('ADMIN', 'HR'), leaveController.updateLeaveStatus);

export default router;

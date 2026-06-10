import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/my', attendanceController.getMyAttendance);

router.get('/', authorizeRoles('ADMIN', 'HR'), attendanceController.getAllAttendance);
router.get('/employee/:employeeId', authorizeRoles('ADMIN', 'HR'), attendanceController.getEmployeeAttendance);
router.get('/:id', authorizeRoles('ADMIN', 'HR'), attendanceController.getAttendanceById);

export default router;

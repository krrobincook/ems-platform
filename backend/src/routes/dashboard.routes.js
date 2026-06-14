import express from 'express';
import { getAdminDashboard, getEmployeeDashboard, getManagerDashboard } from '../controllers/dashboard.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorizeRoles('ADMIN'), getAdminDashboard);
router.get('/manager', authorizeRoles('HR', 'ADMIN'), getManagerDashboard);
router.get('/employee', authorizeRoles('EMPLOYEE', 'ADMIN', 'HR'), getEmployeeDashboard);

export default router;

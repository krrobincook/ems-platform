import mongoose from 'mongoose';
import { Employee } from '../models/employee.model.js';
import { Attendance } from '../models/attendance.model.js';
import { Leave } from '../models/leave.model.js';
import { Task } from '../models/task.model.js';

export const getDashboardStats = async () => {
    const totalEmployees = await Employee.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const attendancesToday = await Attendance.find({
            date: { $gte: today, $lt: tomorrow }
        });
        
        const presentToday = attendancesToday.filter(a => ['PRESENT', 'LATE', 'HALF_DAY'].includes(a.status)).length;
        
        const pendingLeaves = await Leave.countDocuments({ status: 'PENDING' });
        const approvedLeaves = await Leave.countDocuments({ status: 'APPROVED' });

        const tasks = await Task.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const taskStats = {
            TODO: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0
        };
        tasks.forEach(t => {
            if (Object.prototype.hasOwnProperty.call(taskStats, t._id)) {
                taskStats[t._id] = t.count;
            }
        });

        return {
            totalEmployees,
            attendance: {
                totalLoggedToday: attendancesToday.length,
                present: presentToday,
                absent: attendancesToday.filter(a => a.status === 'ABSENT').length,
                onLeave: attendancesToday.filter(a => a.status === 'LEAVE').length
            },
            leaves: {
                pending: pendingLeaves,
                approved: approvedLeaves
            },
            tasks: taskStats
        };
};

export const getEmployeeDashboardStats = async (userId) => {
    const employee = await Employee.findOne({ user: userId });
        if (!employee) {
            throw new Error('Employee profile not found');
        }

        const employeeId = employee._id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const attendanceToday = await Attendance.findOne({
            employee: employeeId,
            date: { $gte: today, $lt: tomorrow }
        });

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const attendanceThisMonth = await Attendance.find({
            employee: employeeId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        
        const presentDaysThisMonth = attendanceThisMonth.filter(a => ['PRESENT', 'LATE', 'HALF_DAY'].includes(a.status)).length;

        const pendingLeaves = await Leave.countDocuments({ employee: employeeId, status: 'PENDING' });
        const approvedLeaves = await Leave.countDocuments({ employee: employeeId, status: 'APPROVED' });

        const tasks = await Task.aggregate([
            { $match: { employeeId: employeeId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        
        const taskStats = {
            TODO: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0
        };
        
        tasks.forEach(t => {
            if (Object.prototype.hasOwnProperty.call(taskStats, t._id)) {
                taskStats[t._id] = t.count;
            }
        });

        return {
            attendance: {
                todayStatus: attendanceToday ? attendanceToday.status : 'NOT_LOGGED',
                presentDaysThisMonth
            },
            leaves: {
                pending: pendingLeaves,
                approved: approvedLeaves
            },
            tasks: taskStats
        };
};

export const getManagerDashboardStats = async (userId) => {
    const objectId = new mongoose.Types.ObjectId(userId);

        const tasks = await Task.aggregate([
            { $match: { createdBy: objectId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const taskStats = {
            TODO: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0
        };
        
        let totalTasksAssigned = 0;
        
        tasks.forEach(t => {
            if (Object.prototype.hasOwnProperty.call(taskStats, t._id)) {
                taskStats[t._id] = t.count;
                totalTasksAssigned += t.count;
            }
        });

        const pendingLeaves = await Leave.countDocuments({ status: 'PENDING' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const attendancesToday = await Attendance.find({
            date: { $gte: today, $lt: tomorrow }
        });
        
        const presentToday = attendancesToday.filter(a => ['PRESENT', 'LATE', 'HALF_DAY'].includes(a.status)).length;
        const totalEmployees = await Employee.countDocuments();

        return {
            tasksAssigned: {
                total: totalTasksAssigned,
                breakdown: taskStats
            },
            pendingApprovals: {
                leaves: pendingLeaves
            },
            teamAttendance: {
                totalEmployees,
                presentToday,
                absentToday: attendancesToday.filter(a => a.status === 'ABSENT').length,
                onLeaveToday: attendancesToday.filter(a => a.status === 'LEAVE').length
            }
        };
};
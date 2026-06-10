import * as attendanceService from '../services/attendance.service.js';
import * as employeeService from '../services/employee.service.js';

export const checkIn = async (req, res) => {
    try {
        let employeeId = req.body.employee;
        if (!employeeId && req.user && req.user._id) {
            const employee = await employeeService.getEmployeeByUserId(req.user._id);
            employeeId = employee._id;
        }

        if (!employeeId) {
            return res.status(400).json({ success: false, message: 'Employee ID is required for check-in' });
        }

        const timeStr = req.body.checkIn || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        const record = await attendanceService.checkIn(employeeId, timeStr);
        return res.status(200).json({
            success: true,
            message: 'Checked in successfully',
            data: record
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Error processing check-in'
        });
    }
};

export const checkOut = async (req, res) => {
    try {
        let employeeId = req.body.employee;
        if (!employeeId && req.user && req.user._id) {
            const employee = await employeeService.getEmployeeByUserId(req.user._id);
            employeeId = employee._id;
        }

        if (!employeeId) {
            return res.status(400).json({ success: false, message: 'Employee ID is required for check-out' });
        }

        const timeStr = req.body.checkOut || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        const record = await attendanceService.checkOut(employeeId, timeStr);
        return res.status(200).json({
            success: true,
            message: 'Checked out successfully',
            data: record
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Error processing check-out'
        });
    }
};

export const getMyAttendance = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
             return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const employee = await employeeService.getEmployeeByUserId(req.user._id);
        
        const { startDate, endDate } = req.query;
        const records = await attendanceService.getAttendanceByEmployee(employee._id, startDate, endDate);
        
        return res.status(200).json({
            success: true,
            message: 'Attendance records retrieved',
            data: records
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getEmployeeAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { startDate, endDate } = req.query;
        
        const records = await attendanceService.getAttendanceByEmployee(employeeId, startDate, endDate);
        
        return res.status(200).json({
            success: true,
            message: 'Attendance records retrieved',
            data: records
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getAllAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        const records = await attendanceService.getAllAttendance(date);
        
        return res.status(200).json({
            success: true,
            message: 'All attendance records retrieved',
            data: records
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await attendanceService.getAttendanceById(id);
        
        return res.status(200).json({
            success: true,
            message: 'Attendance record retrieved',
            data: record
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message || 'Attendance record not found'
        });
    }
};

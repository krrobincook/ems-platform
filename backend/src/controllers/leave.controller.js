import * as leaveService from '../services/leave.service.js';
import * as employeeService from '../services/employee.service.js';

export const applyLeave = async (req, res) => {
    try {
        let employeeId = req.body.employee;
        
        if (!employeeId && req.user && req.user._id) {
            const employee = await employeeService.getEmployeeByUserId(req.user._id);
            employeeId = employee._id;
        }

        if (!employeeId) {
            return res.status(400).json({ success: false, message: 'Employee ID is required to apply for leave' });
        }

        const leave = await leaveService.applyLeave(employeeId, req.body);
        
        return res.status(201).json({
            success: true,
            message: 'Leave application submitted successfully',
            data: leave
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Error processing leave application'
        });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const leaveId = req.params.id;
        const { status } = req.body;
        const managerId = req.user ? req.user._id : null;

        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required' });
        }

        const updatedLeave = await leaveService.updateLeaveStatus(leaveId, status, managerId);
        
        return res.status(200).json({
            success: true,
            message: `Leave request ${status.toLowerCase()} successfully`,
            data: updatedLeave
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Error updating leave status'
        });
    }
};

export const getMyLeaveSummary = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const employee = await employeeService.getEmployeeByUserId(req.user._id);
        const summary = await leaveService.getEmployeeLeaveSummary(employee._id);

        return res.status(200).json({
            success: true,
            message: 'Leave summary retrieved successfully',
            data: summary
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getEmployeeLeaveSummary = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const summary = await leaveService.getEmployeeLeaveSummary(employeeId);

        return res.status(200).json({
            success: true,
            message: 'Employee leave summary retrieved',
            data: summary
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getAllLeaves = async (req, res) => {
    try {
        const { status } = req.query;
        const leaves = await leaveService.getAllLeaves(status);

        return res.status(200).json({
            success: true,
            message: 'Leaves retrieved successfully',
            data: leaves
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

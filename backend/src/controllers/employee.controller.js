import * as employeeService from '../services/employee.service.js';

export const createEmployee = async (req, res) => {
    try {
        const employee = await employeeService.createEmployee(req.body);
        return res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    } catch (error) {
        if (
            error.message === 'Associated User not found' || 
            error.message === 'An employee record already exists for this user' || 
            error.message === 'Employee ID already in use'
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        const employees = await employeeService.getAllEmployees(searchTerm);
        if (searchTerm && employees.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Only search employee using name, id and email'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Employees retrieved successfully',
            data: employees
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Employee retrieved successfully',
            data: employee
        });
    } catch (error) {
        if (error.message === 'Employee not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getEmployeeByUserId = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeByUserId(req.params.userId);
        return res.status(200).json({
            success: true,
            message: 'Employee retrieved successfully',
            data: employee
        });
    } catch (error) {
        if (error.message === 'Employee record not found for this user') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const employee = await employeeService.updateEmployee(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    } catch (error) {
        if (error.message === 'Employee not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const employee = await employeeService.deleteEmployee(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Employee deleted successfully',
            data: employee
        });
    } catch (error) {
        if (error.message === 'Employee not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getMyProfile = async(req, res) => {
    try {
        const userId = req.user._id;
        const employeeProfile = await employeeService.getEmployeeByUserId(userId);
        return res.status(200).json({
            success: true,
            message: 'Employee profile retrieved successfully',
            data: employeeProfile
        })
    } catch (error) {
        if (error.message === 'Employee record not found for this user') {
            return res.status(404).json({
                success: false,
                message: 'Profile not found. Administrator might not have assigned you an employee ID yet.'
            })
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        })
    }
}
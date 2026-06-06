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
            message: error.message || "Internal server error"
        });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        return res.status(200).json({
            success: true,
            message: 'Employees retrieved successfully',
            data: employees
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
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
            message: error.message || "Internal server error"
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
            message: error.message || "Internal server error"
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
            message: error.message || "Internal server error"
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
            message: error.message || "Internal server error"
        });
    }
};

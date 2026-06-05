import { Employee } from '../models/employee.model.js';
import { User } from '../models/user.model.js';

export const createEmployee = async (employeeData) => {
    const userExists = await User.findById(employeeData.user);
    if (!userExists) {
        throw new Error('Associated User not found');
    }

    const existingEmployeeUser = await Employee.findOne({ user: employeeData.user });
    if (existingEmployeeUser) {
        throw new Error('An employee record already exists for this user');
    }

    const existingEmployeeId = await Employee.findOne({ employeeId: employeeData.employeeId });
    if (existingEmployeeId) {
        throw new Error('Employee ID already in use');
    }

    const newEmployee = await Employee.create(employeeData);
    return newEmployee;
};

export const getAllEmployees = async () => {
    return await Employee.find().populate('user', '-password');
};

export const getEmployeeById = async (id) => {
    const employee = await Employee.findById(id).populate('user', '-password');
    if (!employee) {
        throw new Error('Employee not found');
    }
    return employee;
};

export const getEmployeeByUserId = async (userId) => {
    const employee = await Employee.findOne({ user: userId }).populate('user', '-password');
    if (!employee) {
        throw new Error('Employee record not found for this user');
    }
    return employee;
};

export const updateEmployee = async (id, updateData) => {
    if (updateData.user) {
        delete updateData.user;
    }
    
    if (updateData.employeeId) {
        delete updateData.employeeId;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
    ).populate('user', '-password');

    if (!updatedEmployee) {
        throw new Error('Employee not found');
    }

    return updatedEmployee;
};

export const deleteEmployee = async (id) => {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
        throw new Error('Employee not found');
    }
    return deletedEmployee;
};

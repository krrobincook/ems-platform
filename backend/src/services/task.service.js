import { Task } from "../models/task.model.js";
import { Employee } from "../models/employee.model.js";

export const createTask = async(taskData) => {
    const task = await Task.create(taskData);
    return task;
};

export const getTaskById = async (taskId) => {
    const task = await Task.findById(taskId)
        .populate({
            path: 'employeeId',
            populate: { path: 'user', select: 'firstName lastName email' }
        })
        .populate('createBy', 'firstName lastName email');
    
        if(!task){
            throw new Error('Task not found');
        }
        return task;    
};

export const getAllTasks = async (filters = {}) => {
    const query = {};
    if(filters.status) query.status = filters.status;
    if(filters.priority) query.priority = filters.priority;
    if(filters.employeeId) query.employeeId = filters.employeeId;

    return await Task.find(query)
        .populate({
            path: 'employeeId',
            populate: { path: 'user', select: 'firstName lastName email' }
        })
        .sort({ createAt: -1 });
};

export const getEmployeeTasks = async (employeeId, filters = {}) => {
    return await getAllTasks({ ...filters, employeeId });
};

export const getMyTasks = async (userId, filters = {}) => {
    const employee = await Employee.findOne({ user: userId });
    if (!employee) {
        throw new Error('Employee profile not found for this user');
    }
    return await getAllTasks({ ...filters, employeeId: employee._id });
};

export const updateTask = async (taskId, updateData) => {
    const task = await Task.findByIdAndUpdate(
        taskId,
        updateData,
        { new: true, runValidators: true }
    );
    
    if (!task) {
        throw new Error('Task not found');
    }
    
    return task;
};

export const deleteTask = async (taskId) => {
    const task = await Task.findByIdAndDelete(taskId);
    if(!task){
        throw new Error('Task not found');
    }
    return task;
};
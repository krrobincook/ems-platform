import * as taskService from '../services/task.service.js';

export const createTask = async (req, res) => {
    try {
        const taskData = {
            ...req.body,
            createdBy: req.user ? req.user.id : null
        };

        if (!taskData.createdBy) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User missing' });
        }

        const task = await taskService.createTask(taskData);
        
        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Error creating task'
        });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Task retrieved successfully',
            data: task
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message || 'Task not found'
        });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            employeeId: req.query.employeeId
        };
        const tasks = await taskService.getAllTasks(filters);

        return res.status(200).json({
            success: true,
            message: 'Tasks retrieved successfully',
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving tasks'
        });
    }
};

export const getMyTasks = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const filters = {
            status: req.query.status,
            priority: req.query.priority
        };

        const tasks = await taskService.getMyTasks(req.user.id, filters);

        return res.status(200).json({
            success: true,
            message: 'Your tasks retrieved successfully',
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving your tasks'
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.id, req.body);
        
        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Error updating task'
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Error deleting task'
        });
    }
};
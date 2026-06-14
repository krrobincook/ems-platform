import * as dashboardService from '../services/dashboard.service.js';

export const getAdminDashboard = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
};

export const getEmployeeDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await dashboardService.getEmployeeDashboardStats(userId);
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching employee dashboard stats:', error);
        if (error.message === 'Employee profile not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch employee dashboard statistics'
        });
    }
};

export const getManagerDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await dashboardService.getManagerDashboardStats(userId);
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching manager dashboard stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch manager dashboard statistics'
        });
    }
};
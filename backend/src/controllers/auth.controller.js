import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        if(error.message === 'User with this email already exists') {
            return res.status(409).json({
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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message.includes('account has been deactivated')) {
            return res.status(403).json({
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
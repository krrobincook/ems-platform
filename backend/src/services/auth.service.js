import { User } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';

export const registerUser = async (userData) => {
    const { firstName, lastName, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'EMPLOYEE'
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;
    return userResponse;
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
        throw new Error('Your account has been deactivated. Please contact HR.');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user); 

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
        user: userResponse,
        accessToken,
        refreshToken
    };
};

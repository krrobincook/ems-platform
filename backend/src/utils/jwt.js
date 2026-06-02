import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '15m'
        }
    );
};

export const generateRefreshToken = (user) => {
    // The refresh token usually only needs the user's ID
    const payload = {
        id: user._id
    };

    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '7d' // Lasts much longer, e.g., 7 days
        }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );
    } catch (error) {
        return null;
    }
};
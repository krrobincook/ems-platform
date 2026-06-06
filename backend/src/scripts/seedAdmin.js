import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import { User } from '../models/user.model.js';
import { hashPassword } from '../utils/hash.js';

// Load env variables relative to CWD
dotenv.config({ path: '../.env' });

const seedAdmin = async () => {
    try {
        await connectDB();
        
        const existingAdmin = await User.findOne({ role: 'ADMIN' });
        
        if (existingAdmin) {
            console.log(`[SEED] An ADMIN user already exists (${existingAdmin.email}). Seed aborted.`);
            process.exit(0);
        }

        const hashedPassword = await hashPassword('admin123');

        await User.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@ems.com',
            password: hashedPassword,
            role: 'ADMIN'
        });

        console.log('[SEED] Successfully created the initial ADMIN account!');
        console.log('[CREDENTIALS] Email: admin@ems.com  |  Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Failed to seed admin user:', error);
        process.exit(1);
    }
};

seedAdmin();

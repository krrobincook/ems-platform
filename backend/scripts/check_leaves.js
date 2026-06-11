import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/database.js';
import { Leave } from '../src/models/leave.model.js';

dotenv.config({ path: '../.env' });

const checkLeaves = async () => {
    try {
        await connectDB();
        console.log('ALL LEAVES IN DB:');
        const leaves = await Leave.find({});
        console.log(JSON.stringify(leaves, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkLeaves();

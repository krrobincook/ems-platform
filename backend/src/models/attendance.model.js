import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE', 'HALF_DAY'],
            default: 'PRESENT'
        },
        checkIn: {
            type: String, 
            trim: true
        },
        checkOut: {
            type: String,
            trim: true
        },
        remarks: {
            type: String,
            trim: true
        }
    },
    { 
        timestamps: true 
    }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);

import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        department: {
            type: String,
            required: true,
            trim: true
        },
        designation: {
            type: String,
            required: true,
            trim: true
        },
        salary: {
            type: Number,
            required: true
        },
        dateOfJoining: {
            type: Date,
            required: true
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

export const Employee = mongoose.model('Employee', employeeSchema);

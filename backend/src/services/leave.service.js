import { Leave } from '../models/leave.model.js';
import { Employee } from '../models/employee.model.js';

const getLeaveDaysCount = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((end - start) / msPerDay) + 1;
};

export const applyLeave = async (employeeId, leaveData) => {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
        throw new Error('Employee not found');
    }

    const { startDate, endDate, ...rest } = leaveData;
    const requestedDays = getLeaveDaysCount(startDate, endDate);
    
    if (requestedDays <= 0) {
        throw new Error('End date must be on or after start date');
    }

    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);


    const approvedLeaves = await Leave.find({
        employee: employeeId,
        status: 'APPROVED',
        startDate: { $gte: startOfYear, $lte: endOfYear }
    });

    let totalApprovedDays = 0;
    approvedLeaves.forEach(leave => {
        totalApprovedDays += getLeaveDaysCount(leave.startDate, leave.endDate);
    });

    if (totalApprovedDays + requestedDays > 10) {
        throw new Error(`Leave application failed. You are requesting ${requestedDays} day(s), but only have ${10 - totalApprovedDays} day(s) left for this year.`);
    }

    const leave = await Leave.create({
        employee: employeeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ...rest
    });

    return leave;
};

export const updateLeaveStatus = async (leaveId, status, managerId) => {
    const leave = await Leave.findById(leaveId);
    if (!leave) {
        throw new Error('Leave request not found');
    }

    if (leave.status !== 'PENDING') {
        throw new Error(`Cannot update leave that is already ${leave.status}`);
    }

    leave.status = status;
    leave.reviewedBy = managerId;
    await leave.save();

    return leave;
};

export const getEmployeeLeaveSummary = async (employeeId) => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

    const leaves = await Leave.find({
        employee: employeeId,
        startDate: { $gte: startOfYear, $lte: endOfYear }
    });

    const summary = {
        totalAllowed: 10,
        totalTaken: 0,
        balance: 10,
        categories: {
            SICK_LEAVE: 0,
            CASUAL_LEAVE: 0,
            MATERNITY_LEAVE: 0,
            UNPAID: 0
        },
        requests: leaves
    };

    leaves.forEach(leave => {
        if (leave.status === 'APPROVED') {
            const days = getLeaveDaysCount(leave.startDate, leave.endDate);
            summary.totalTaken += days;
            if (summary.categories[leave.type] !== undefined) {
                summary.categories[leave.type] += days;
            } else {
                summary.categories[leave.type] = days;
            }
        }
    });

    summary.balance = summary.totalAllowed - summary.totalTaken;

    return summary;
};

export const getAllLeaves = async (status) => {
    const query = {};
    if (status) {
        query.status = status;
    }
    return await Leave.find(query).populate({
        path: 'employee',
        populate: { path: 'user', select: 'firstName lastName email' }
    }).sort({ createdAt: -1 });
};

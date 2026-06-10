import { Attendance } from '../models/attendance.model.js';
import { Employee } from '../models/employee.model.js';

export const getAttendanceByEmployee = async (employeeId, startDate, endDate) => {
    const query = { employee: employeeId };

    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    return await Attendance.find(query).sort({ date: -1 });
};

export const getAttendanceById = async (id) => {
    const attendance = await Attendance.findById(id).populate('employee');
    if (!attendance) {
        throw new Error('Attendance record not found');
    }
    return attendance;
};

export const getAllAttendance = async (date) => {
    const query = {};
    if (date) {
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        query.date = searchDate;
    }
    return await Attendance.find(query).populate({
        path: 'employee',
        populate: { path: 'user', select: 'firstName lastName email' }
    });
};

const calculateWorkingHours = (checkInStr, checkOutStr) => {
    if (!checkInStr || !checkOutStr) return 0;
    
    const [inHours, inMinutes] = checkInStr.split(':').map(Number);
    const [outHours, outMinutes] = checkOutStr.split(':').map(Number);
    
    const checkInDate = new Date();
    checkInDate.setHours(inHours, inMinutes, 0, 0);
    
    const checkOutDate = new Date();
    checkOutDate.setHours(outHours, outMinutes, 0, 0);
    
    const diffMs = checkOutDate - checkInDate;
    if (diffMs < 0) {
        return 0; 
    }
    
    const diffHrs = diffMs / (1000 * 60 * 60);
    return parseFloat(diffHrs.toFixed(2));
};

export const checkIn = async (employeeId, timeStr) => {
    const employeeExists = await Employee.findById(employeeId);
    if (!employeeExists) {
        throw new Error('Employee not found');
    }

    const recordDate = new Date();
    recordDate.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({
        employee: employeeId,
        date: recordDate
    });

    if (record) {
        if (record.checkIn) {
            throw new Error('Already checked in today');
        }
        record.checkIn = timeStr;
        record.status = 'PRESENT';
        await record.save();
    } else {
        record = await Attendance.create({
            employee: employeeId,
            date: recordDate,
            checkIn: timeStr,
            status: 'PRESENT'
        });
    }

    return record;
};

export const checkOut = async (employeeId, timeStr) => {
    const recordDate = new Date();
    recordDate.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({
        employee: employeeId,
        date: recordDate
    });

    if (!record) {
        throw new Error('No attendance record found for today. Please check in first.');
    }

    if (record.checkOut) {
        throw new Error('Already checked out today');
    }

    record.checkOut = timeStr;
    await record.save();

    const workingHours = calculateWorkingHours(record.checkIn, record.checkOut);
    
    const recordObj = record.toObject();
    recordObj.workingHours = workingHours;

    return recordObj;
};
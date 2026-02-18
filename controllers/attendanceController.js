const Attendance = require('../models/Attendance');

// @desc    Mark attendance (Check-in/Check-out)
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
    const { status } = req.body; // Can be used to set status directly if needed, otherwise handled by logic

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if attendance record exists for today
        let attendance = await Attendance.findOne({
            user: req.user._id,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (attendance) {
            // If already checked in, process check-out
            if (!attendance.checkOut) {
                attendance.checkOut = Date.now();
                await attendance.save();
                return res.json({ message: 'Checked out successfully', attendance });
            } else {
                return res.status(400).json({ message: 'Already marked attendance for today' });
            }
        } else {
            // First time today -> Check in
            attendance = await Attendance.create({
                user: req.user._id,
                date: Date.now(),
                checkIn: Date.now(),
                status: 'Present'
            });
            return res.status(201).json({ message: 'Checked in successfully', attendance });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private (HR: all, Employee: own)
const getAttendance = async (req, res) => {
    try {
        let attendance;
        if (req.user.role === 'HR') {
            attendance = await Attendance.find().populate('user', 'name email');
        } else {
            attendance = await Attendance.find({ user: req.user._id });
        }
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { markAttendance, getAttendance };

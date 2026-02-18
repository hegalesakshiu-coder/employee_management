const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half-Day', 'Leave'],
        default: 'Absent',
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

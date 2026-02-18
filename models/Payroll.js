const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    baseSalary: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    bonuses: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Processing'],
        default: 'Processing',
    },
    paymentDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;

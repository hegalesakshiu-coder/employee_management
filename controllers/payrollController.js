const Payroll = require('../models/Payroll');

// @desc    Generate/Add payroll record
// @route   POST /api/payroll
// @access  Private/HR
const createPayroll = async (req, res) => {
    const { user, month, year, baseSalary, deductions, bonuses, status, paymentDate } = req.body;

    try {
        const netSalary = baseSalary + bonuses - deductions;

        const payroll = await Payroll.create({
            user,
            month,
            year,
            baseSalary,
            deductions,
            bonuses,
            netSalary,
            status,
            paymentDate
        });

        res.status(201).json(payroll);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get payroll records
// @route   GET /api/payroll
// @access  Private (HR: all, Employee: own)
const getPayroll = async (req, res) => {
    try {
        let payrolls;
        if (req.user.role === 'HR') {
            payrolls = await Payroll.find().populate('user', 'name email');
        } else {
            payrolls = await Payroll.find({ user: req.user._id });
        }
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPayroll, getPayroll };

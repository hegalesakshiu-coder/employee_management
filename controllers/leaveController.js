const Leave = require('../models/Leave');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private/Employee
const applyLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    try {
        const leave = await Leave.create({
            user: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all leaves (HR view all, Employee view own)
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
    try {
        let leaves;
        if (req.user.role === 'HR') {
            leaves = await Leave.find().populate('user', 'name email');
        } else {
            leaves = await Leave.find({ user: req.user._id });
        }
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private/HR
const updateLeaveStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const leave = await Leave.findById(req.params.id);

        if (leave) {
            leave.status = status;
            const updatedLeave = await leave.save();
            res.json(updatedLeave);
        } else {
            res.status(404).json({ message: 'Leave request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus };

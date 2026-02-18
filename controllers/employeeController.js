const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/HR
const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'Employee' }).select('-password');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/employees/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/HR
const createEmployee = async (req, res) => {
    const { name, email, password, department, designation, salary } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            department,
            designation,
            salary,
            role: 'Employee'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/HR
const deleteEmployee = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEmployees, getUserProfile, createEmployee, deleteEmployee };

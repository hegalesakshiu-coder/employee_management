const express = require('express');
const router = express.Router();
const { getEmployees, getUserProfile, createEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('HR'), getEmployees)
    .post(protect, authorize('HR'), createEmployee);

router.route('/profile') // Look at own profile
    .get(protect, getUserProfile);

router.route('/:id')
    .delete(protect, authorize('HR'), deleteEmployee);

module.exports = router;

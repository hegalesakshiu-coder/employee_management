const express = require('express');
const router = express.Router();
const { createPayroll, getPayroll } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('HR'), createPayroll)
    .get(protect, getPayroll);

module.exports = router;

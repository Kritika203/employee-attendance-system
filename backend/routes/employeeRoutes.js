const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { getEmployees, addEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

router.get('/', protect, getEmployees);
router.post('/', protect, isAdmin, addEmployee);
router.put('/:id', protect, isAdmin, updateEmployee);
router.delete('/:id', protect, isAdmin, deleteEmployee);

module.exports = router;
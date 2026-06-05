const Employee = require('../models/Employee');
const mongoose = require('mongoose');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const { name, phone, department } = req.body;

    if (!name || !phone || !department)
      return res.status(400).json({ message: 'Name, phone and department are required' });

    if (!/^[a-zA-Z\s]+$/.test(name))
      return res.status(400).json({ message: 'Name must contain letters only' });

    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ message: 'Phone must be exactly 10 digits' });

    if (!/^[a-zA-Z\s]+$/.test(department))
      return res.status(400).json({ message: 'Department must contain letters only' });

    const count = await Employee.countDocuments();
    const employeeCode = `EMP${String(count + 1).padStart(3, '0')}`;

    const employee = new Employee({ name, phone, department, employeeCode });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error('ADD EMPLOYEE ERROR:', err)
    res.status(500).json({ message: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { name, phone, department } = req.body;

    if (!name || !phone || !department)
      return res.status(400).json({ message: 'Name, phone and department are required' });

    if (!/^[a-zA-Z\s]+$/.test(name))
      return res.status(400).json({ message: 'Name must contain letters only' });

    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ message: 'Phone must be exactly 10 digits' });

    if (!/^[a-zA-Z\s]+$/.test(department))
      return res.status(400).json({ message: 'Department must contain letters only' });

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, phone, department },
      { new: true }
    );
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid employee ID' });

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
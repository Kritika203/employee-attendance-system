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

    const employee = new Employee({ name, phone, department });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { name, phone, department } = req.body;

    if (!name || !phone || !department)
      return res.status(400).json({ message: 'Name, phone and department are required' });

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
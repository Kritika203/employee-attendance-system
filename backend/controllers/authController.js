const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.employeeLogin = async (req, res) => {
  try {
    const { employeeCode } = req.body;

    if (!employeeCode)
      return res.status(400).json({ message: 'Employee code is required' });

    const employee = await Employee.findOne({ employeeCode });
    if (!employee) return res.status(400).json({ message: 'Invalid employee code' });

    const token = jwt.sign(
      { id: employee._id, role: 'employee' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        department: employee.department,
        employeeCode: employee.employeeCode
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
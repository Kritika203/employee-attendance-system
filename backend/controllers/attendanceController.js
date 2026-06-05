const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status)
      return res.status(400).json({ message: 'employeeId, date and status are required' });

    if (!mongoose.Types.ObjectId.isValid(employeeId))
      return res.status(400).json({ message: 'Invalid employee ID' });

    if (!['Present', 'Absent'].includes(status))
      return res.status(400).json({ message: 'Status must be Present or Absent' });

    const existing = await Attendance.findOne({ employeeId, date });
    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json(existing);
    }

    const attendance = new Attendance({ employeeId, date, status });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { date, employeeId } = req.query;
    let filter = {};

    if (date) filter.date = date;
    if (employeeId) {
      if (!mongoose.Types.ObjectId.isValid(employeeId))
        return res.status(400).json({ message: 'Invalid employee ID' });
      filter.employeeId = employeeId;
    }

    const attendance = await Attendance.find(filter).populate('employeeId', 'name department');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
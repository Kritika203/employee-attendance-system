const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

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
    if (employeeId) filter.employeeId = employeeId;

    const attendance = await Attendance.find(filter).populate('employeeId', 'name department');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
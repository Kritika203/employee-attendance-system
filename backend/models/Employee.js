const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  employeeCode: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
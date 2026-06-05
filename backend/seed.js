const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: 'admin@attendance.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@attendance.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: admin@attendance.com');
    console.log('Password: admin123');
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/undefined values for optional unique field
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    profileImage: {
      type: String,
      default: ''
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true // Auto-generates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', UserSchema);

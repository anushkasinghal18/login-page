const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// --- Mock In-Memory Store ---
let mockUserIdCounter = 1;
const createMockUser = (email, password, role, firstName, lastName = '', mobile = '') => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return {
    _id: `mock_id_${mockUserIdCounter++}`,
    firstName: firstName || role.charAt(0).toUpperCase() + role.slice(1),
    lastName,
    email: email.toLowerCase().trim(),
    mobile,
    password: hashedPassword,
    role,
    isActive: true,
    isVerified: true,
    profileImage: '',
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const mockUsers = [
  createMockUser('student@test.com', '123456', 'student', 'Default', 'Student'),
  createMockUser('teacher@test.com', '123456', 'teacher', 'Default', 'Teacher'),
  createMockUser('admin@test.com', '123456', 'admin', 'Default', 'Admin')
];

const MockUserService = {
  findUserByEmail: async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    return mockUsers.find(u => u.email === normalizedEmail) || null;
  },

  findUserById: async (id) => {
    return mockUsers.find(u => u._id === id) || null;
  },

  createUser: async (userData) => {
    const normalizedEmail = userData.email.toLowerCase().trim();
    
    // Check duplicates in-memory
    const existingEmail = mockUsers.find(u => u.email === normalizedEmail);
    if (existingEmail) {
      throw new Error('An account with this email already exists.');
    }
    if (userData.mobile) {
      const existingMobile = mockUsers.find(u => u.mobile === userData.mobile);
      if (existingMobile) {
        throw new Error('This mobile number is already registered.');
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);

    const newUser = {
      _id: `mock_id_${mockUserIdCounter++}`,
      firstName: userData.firstName,
      lastName: userData.lastName || '',
      email: normalizedEmail,
      mobile: userData.mobile || '',
      password: hashedPassword,
      role: userData.role || 'student',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      isVerified: userData.isVerified !== undefined ? userData.isVerified : false,
      profileImage: userData.profileImage || '',
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.push(newUser);
    return newUser;
  },

  updateLastLogin: async (userId) => {
    const user = mockUsers.find(u => u._id === userId);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      return user;
    }
    return null;
  }
};

// --- Mongo Database Store ---
const MongoUserService = {
  findUserByEmail: async (email) => {
    return await User.findOne({ email: email.toLowerCase().trim() });
  },

  findUserById: async (id) => {
    return await User.findById(id);
  },

  createUser: async (userData) => {
    const normalizedEmail = userData.email.toLowerCase().trim();
    
    // Check duplicates in MongoDB
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      throw new Error('An account with this email already exists.');
    }
    if (userData.mobile) {
      const existingMobile = await User.findOne({ mobile: userData.mobile });
      if (existingMobile) {
        throw new Error('This mobile number is already registered.');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new User({
      ...userData,
      email: normalizedEmail,
      password: hashedPassword
    });

    return await newUser.save();
  },

  updateLastLogin: async (userId) => {
    return await User.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { new: true }
    );
  }
};

// --- Dynamic Service Dispatcher ---
const getUserService = () => {
  if (getIsConnected()) {
    return MongoUserService;
  }
  return MockUserService;
};

module.exports = {
  findUserByEmail: (email) => getUserService().findUserByEmail(email),
  findUserById: (id) => getUserService().findUserById(id),
  createUser: (userData) => getUserService().createUser(userData),
  updateLastLogin: (userId) => getUserService().updateLastLogin(userId),
  _mockUsersList: mockUsers
};

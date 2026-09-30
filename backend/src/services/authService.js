const User = require('../models/User');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');

exports.registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  // We intentionally block 'role' from being set maliciously during registration here
  const newUser = await User.create({ name, email, password });
  return newUser;
};

exports.loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  return user;
};

exports.addRefreshTokenToUser = async (user, newRefreshToken) => {
  user.refreshTokens.push(newRefreshToken);
  await user.save({ validateBeforeSave: false });
};

exports.removeRefreshTokenFromUser = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: refreshToken }
  });
};

exports.findUserByRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    return { user, decoded };
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};

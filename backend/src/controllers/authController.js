const authService = require('../services/authService');
const { generateTokens, setCookie, clearCookie } = require('../utils/tokenUtils');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

exports.register = asyncHandler(async (req, res, next) => {
  const newUser = await authService.registerUser(req.body);
  const { accessToken, refreshToken } = generateTokens(newUser._id);

  await authService.addRefreshTokenToUser(newUser, refreshToken);

  // Send the refresh token in an HTTP-only cookie
  setCookie(res, 'jwt', refreshToken);

  // Hide password fields from returning JSON payload
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    token: accessToken,
    data: { user: newUser },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);
  
  const { accessToken, refreshToken } = generateTokens(user._id);

  await authService.addRefreshTokenToUser(user, refreshToken);

  // Send the refresh token in an HTTP-only cookie
  setCookie(res, 'jwt', refreshToken);

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token: accessToken,
    data: { user },
  });
});

exports.refresh = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies || !cookies.jwt) {
    return next(new AppError('No refresh token provided', 401));
  }

  const oldRefreshToken = cookies.jwt;

  // Retrieve user validating the specific token hash
  const { user } = await authService.findUserByRefreshToken(oldRefreshToken);

  // Reissue Tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Manage token list securely in the DB (remove old, add new to rotate)
  await authService.removeRefreshTokenFromUser(user._id, oldRefreshToken);
  await authService.addRefreshTokenToUser(user, refreshToken);

  // Set the newly rotated cookie
  setCookie(res, 'jwt', refreshToken);

  res.status(200).json({
    status: 'success',
    token: accessToken,
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt) {
    return res.status(204).json({ status: 'success' }); // No content, already logged out
  }

  const refreshToken = cookies.jwt;

  // Attempt to remove it from DB if req.user exists from protect middleware 
  // or decode it manually (for simplicity, we assume req.user is populated if this was protected, 
  // but if the user just clicks logout without access token, we can just clear the cookie anyway).
  if (req.user) {
    await authService.removeRefreshTokenFromUser(req.user._id, refreshToken);
  }

  clearCookie(res, 'jwt');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  // `req.user` should be loaded completely by the protect middleware.
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

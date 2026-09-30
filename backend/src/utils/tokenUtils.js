const jwt = require('jsonwebtoken');

exports.generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

exports.setCookie = (res, name, value, options = {}) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    ...options
  };

  res.cookie(name, value, cookieOptions);
};

exports.clearCookie = (res, name) => {
  res.cookie(name, 'none', {
    expires: new Date(Date.now() + 10 * 1000), // expire in 10s
    httpOnly: true,
  });
};

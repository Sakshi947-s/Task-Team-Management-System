const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    console.log("HEADERS:", req.headers);

  // token from x-auth-token OR Authorization Bearer
  let token = req.header('x-auth-token');

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // 👈 IMPORTANT
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

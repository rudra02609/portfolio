const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token =
    (req.headers.authorization && req.headers.authorization.split(' ')[1]) || null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

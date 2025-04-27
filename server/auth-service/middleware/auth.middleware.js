import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT token
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id, role }
    req.headers['x-user-id'] = decoded.id; 
    req.headers['x-user-role'] = decoded.role; // Add user role to headers
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to authorize user roles
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};

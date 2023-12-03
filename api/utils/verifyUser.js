import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'You are not authenticated!'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);

      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, 'Token has expired'));
      } else {
        return next(errorHandler(403, 'Token is not valid'));
      }
    }

    console.log('Decoded user:', user);
    req.user = user; // Attach the decoded user to the request
    next();
  });
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next({ status: 401, message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded as { id: string; role: string };
    next();
  } catch (err) {
    return next({ status: 403, message: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ status: 401, message: 'Unauthorized: No user information' }); 
      }
  
      if (!roles.includes(req.user.role)) {
        return next({ status: 403, message: 'Forbidden: Insufficient permissions' }); 
      }
    next();
  };
};
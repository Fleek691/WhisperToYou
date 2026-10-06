import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminAuthRequest extends Request {
  admin?: any;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access denied. Authorization token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'whisper_to_you_super_secret_jwt';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
};

export const authenticateAdmin = (req: AdminAuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access denied. Authorization token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'whisper_to_you_super_secret_jwt';

  try {
    const decoded: any = jwt.verify(token, secret);
    if (decoded.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admin role required.' });
      return;
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/request.js';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for token in Authorization header
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    // If no token in header, check cookies
    if (!token) {
      token = req.cookies?.token;
    }

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'JWT secret not configured' });
      return;
    }

    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: 'Invalid token' });
        return;
      }

      // Store token in cookie if it came from Authorization header
      if (authHeader) {
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
      }

      // Ensure the decoded token has a valid user ID
      if (!decoded || typeof decoded.id !== 'number') {
        console.error('Invalid token payload:', decoded);
        res.status(403).json({ message: 'Invalid token payload' });
        return;
      }

      req.user = {
        id: decoded.id
      };
      next();
    });
  } catch (error) {
    console.error('Error authenticating token:', error);
    res.status(500).json({ message: 'Error authenticating token' });
  }
}; 
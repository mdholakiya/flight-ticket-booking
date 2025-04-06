// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//   };
// }

// export const authenticateToken = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       res.status(401).json({ message: 'No token provided' });
//       return;
//     }

//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//       res.status(500).json({ message: 'JWT secret not configured' });
//       return;
//     }

//     jwt.verify(token, secret, (err: any, decoded: any) => {
//       if (err) {
//         res.status(403).json({ message: 'Invalid token' });
//         return;
//       }

//       req.user = {
//         id: decoded.userId
//       };
//       next();
//     });
//   } catch (error) {
//     console.error('Error authenticating token:', error);
//     res.status(500).json({ message: 'Error authenticating token' });
//   }
// }; 
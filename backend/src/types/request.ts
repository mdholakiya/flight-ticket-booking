import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}

export interface AuthRequest extends Request {
  user?: Express.User;
}

export interface UpdateProfileRequest extends AuthRequest {
  body: {
    name?: string;
    email?: string;
    otp: string;
  };
} 
import { Request } from 'express';
import { UserPreferences } from '../models/user.js';

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export interface UpdateProfileRequest extends AuthRequest {
  body: {
    name?: string;
    email?: string;
  };
}

export interface UpdatePreferencesRequest extends AuthRequest {
  body: Partial<UserPreferences>;
} 
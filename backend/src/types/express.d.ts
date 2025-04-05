import { User } from '../models/user.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {}; 
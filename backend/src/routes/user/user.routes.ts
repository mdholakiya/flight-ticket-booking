import { Router } from 'express';
import { 
  getProfile, 
  requestProfileUpdateOTP, 
  verifyOTPAndUpdateProfile 
} from '../../controllers/user/user.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

// Profile routes
router.get('/profile', authenticateToken, getProfile);
router.post('/request-otp', authenticateToken, requestProfileUpdateOTP);
router.put('/profile', authenticateToken, verifyOTPAndUpdateProfile);

export default router; 
import { Router } from 'express';
import { getProfile, updateProfile, getPreferences, updatePreferences } from '../../controllers/user/user.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { AuthRequest, UpdateProfileRequest, UpdatePreferencesRequest } from '../../types/request.js';

const router = Router();

// Profile routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Preferences routes
router.get('/preferences', authenticateToken, getPreferences);
router.put('/preferences', authenticateToken, updatePreferences);

export default router; 
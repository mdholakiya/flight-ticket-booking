import express from 'express';
import { Router } from 'express';
import {
    register,
    login,
    logout
} from '../../controllers/auth/auth.controller.js';

const router: Router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router; 
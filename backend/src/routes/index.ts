import express from 'express';
import { Router } from 'express';
import authRoutes from './auth/auth.routes.js';
import flightRoutes from './flight/flight.routes.js';
import bookingRoutes from './booking/booking.routes.js';
import userRoutes from './user/user.routes.js';

const router: Router = express.Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}`, flightRoutes);
router.use(`${API_PREFIX}`, bookingRoutes);
router.use(`${API_PREFIX}`, userRoutes);

export default router;
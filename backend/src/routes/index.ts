import { Router } from 'express';
import authRoutes from './auth/auth.routes.js';
import flightRoutes from './flight/flight.routes.js';
import bookingRoutes from './booking/booking.routes.js';
import userRoutes from './user/user.routes.js';
// import paymentRoutes from './payment/payment.routes.js';

const router = Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/flights`, flightRoutes);
router.use(`${API_PREFIX}/bookings`, bookingRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
// router.use(`${API_PREFIX}/payments`, paymentRoutes);

export default router;
import { Router, RequestHandler } from 'express';
import {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    getUserBookings,
    processPayment,
    confirmBooking
} from '../../controllers/booking/booking.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// Apply authentication middleware to all booking routes
router.use(authenticate as RequestHandler);

// Booking routes
router.post('/bookings', createBooking as RequestHandler);
router.get('/bookings', getAllBookings as RequestHandler);
router.get('/bookings/:id', getBookingById as RequestHandler);
router.put('/bookings/:id', updateBooking as RequestHandler);
router.delete('/bookings/:id', cancelBooking as RequestHandler);

// User bookings
router.get('/bookings/user', getUserBookings as RequestHandler);

// Booking payment and confirmation
router.post('/bookings/:id/payment', processPayment as RequestHandler);
router.post('/bookings/:id/confirm', confirmBooking as RequestHandler);

export default router; 
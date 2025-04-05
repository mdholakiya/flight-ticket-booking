import express from 'express';
import { Router } from 'express';
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

const router: Router = express.Router();

// Booking routes
router.post('/bookings', createBooking);
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', cancelBooking);

// User bookings
router.get('/bookings/user/:userId', getUserBookings);

// Booking payment and confirmation
router.post('/bookings/:id/payment', processPayment);
router.post('/bookings/:id/confirm', confirmBooking);

export default router; 
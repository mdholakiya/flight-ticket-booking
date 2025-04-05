import express from 'express';
// import { register, login } from '../controllers/userController.js';
import { getAllFlights,  searchFlights } from '../controllers/flightController.js';

const router = express.Router();

// User routes
// router.post('/user/registration', register);
// router.post('/user/login', login);

// Flight routes
router.get('/flight', getAllFlights);
router.get('/flights/search', searchFlights);
// router.get('/flights/:id', getFlightById);

export default router;
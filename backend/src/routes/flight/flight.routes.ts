import express from 'express';
import { Router } from 'express';
import {
    getAllFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight,
    searchFlights
} from '../../controllers/flight/flight.controller.js';

const router: Router = express.Router();

// Flight routes
router.get('/flights', getAllFlights);
router.get('/flights/:id', getFlightById);
router.post('/flights', createFlight);
router.put('/flights/:id', updateFlight);
router.delete('/flights/:id', deleteFlight);

// Search routes
router.get('/flights/search', searchFlights);

export default router; 
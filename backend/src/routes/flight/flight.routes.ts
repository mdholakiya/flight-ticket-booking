import express from 'express';
import { Router } from 'express';
import {
    getAllFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight,
    searchFlights,
    filterFlights
} from '../../controllers/flight/flight.controller.js';

const router: Router = express.Router();

// Flight routes
router.get('/flights', getAllFlights);
router.get('/flights/filter', filterFlights);
router.get('/flights/search', searchFlights);
router.get('/flights/:id', getFlightById);
router.post('/flights', createFlight);
router.put('/flights/:id', updateFlight);
router.delete('/flights/:id', deleteFlight);

export default router; 
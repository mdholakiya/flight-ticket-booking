import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import Flight from '../../models/flight.js';

interface FlightData {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  classType: 'Economy' | 'Business Class' | 'First Class';
  [key: string]: any;
}

interface FlightSearchQuery extends ParsedQs {
  departureAirport?: string;
  arrivalAirport?: string;
  departureTime?: string;
}

interface FlightRequest extends Request {
  body: FlightData;
}

interface FlightSearchRequest extends Request {
  query: FlightSearchQuery;
}

export const getAllFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const flights = await Flight.findAll();
    console.log('all flights', flights);
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Error fetching flights' });
  }
};

export const getFlightById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const flight = await Flight.findByPk(id);
    
    if (!flight) {
      res.status(404).json({ message: 'Flight not found' });
      return;
    }
    console.log('specificflight', flight);
    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ message: 'Error fetching flight' });
  }
};

export const createFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
      classType,
    } = req.body;

    // Log the request body for debugging
    console.log('Request body:', req.body);

    // Validate required fields
    if (!flightNumber || !departureAirport || !arrivalAirport || !departureTime || !arrivalTime || !price || !availableSeats || !classType) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate dates
    const parsedDepartureTime = new Date(departureTime);
    const parsedArrivalTime = new Date(arrivalTime);

    if (isNaN(parsedDepartureTime.getTime()) || isNaN(parsedArrivalTime.getTime())) {
      res.status(400).json({ message: 'Invalid date format for departure or arrival time' });
      return;
    }

    // Validate that departure time is before arrival time
    if (parsedDepartureTime >= parsedArrivalTime) {
      res.status(400).json({ message: 'Departure time must be before arrival time' });
      return;
    }

    // Validate price and seats
    if (typeof price !== 'number' || price <= 0) {
      res.status(400).json({ message: 'Price must be a positive number' });
      return;
    }

    if (typeof availableSeats !== 'number' || availableSeats < 0) {
      res.status(400).json({ message: 'Available seats must be a non-negative number' });
      return;
    }

    // Validate class type
    const validClassTypes = ['Economy', 'Business Class', 'First Class'];
    if (!validClassTypes.includes(classType)) {
      res.status(400).json({ message: 'Invalid class type' });
      return;
    }

    const flight = await Flight.create({
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime: parsedDepartureTime,
      arrivalTime: parsedArrivalTime,
      price,
      availableSeats,
      classType
    });

    console.log('Flight created:', flight);
    res.status(201).json(flight);
  } catch (error: any) {
    console.error('Error creating flight:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Flight number already exists' });
      return;
    }
    res.status(500).json({ message: 'Error creating flight', error: error.message });
  }
};

export const updateFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const flight = await Flight.findByPk(id);
    if (!flight) {
      res.status(404).json({ message: 'Flight not found' });
      return;
    }
    
    await flight.update(req.body);
    console.log('Flight updated:', flight);
    res.json(flight);
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(500).json({ message: 'Error updating flight' });
  }
};

export const deleteFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const flight = await Flight.findByPk(id);
    
    if (!flight) {
      res.status(404).json({ message: 'Flight not found' });
      return;
    }
    
    await flight.destroy();
    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    res.status(500).json({ message: 'Error deleting flight' });
  }
};

export const searchFlights = async (req: FlightSearchRequest, res: Response): Promise<void> => {
  try {
    const { departure_airport, arrival_airport, departure_time } = req.query;
    
    const where: any = {};
    if (departure_airport) where.departure_airport = departure_airport;
    if (arrival_airport) where.arrival_airport = arrival_airport;
    if (departure_time) where.departure_time = departure_time;
    
    const flights = await Flight.findAll({ where });
    res.json(flights);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ message: 'Error searching flights' });
  }
}; 
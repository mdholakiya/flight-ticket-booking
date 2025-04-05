import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import Flight from '../../models/flight.js';

interface FlightData {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
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
    
    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ message: 'Error fetching flight' });
  }
};

export const createFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({ message: 'Error creating flight' });
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
    const { departureAirport, arrivalAirport, departureTime } = req.query;
    
    const where: any = {};
    if (departureAirport) where.departureAirport = departureAirport;
    if (arrivalAirport) where.arrivalAirport = arrivalAirport;
    if (departureTime) where.departureTime = departureTime;
    
    const flights = await Flight.findAll({ where });
    res.json(flights);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ message: 'Error searching flights' });
  }
}; 
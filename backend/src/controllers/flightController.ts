import { Request, Response } from 'express';
import Flight from '../models/flight.js';

// export const getAllFlights = async (req: Request, res: Response) => {
//   try {
//     const flights = await Flight.findAll();
//     console.log("here is lgggnnfgnv")
//     res.json(flights);
//   } catch (error) {
//     console.error('Error fetching flights:', error);
//     res.status(500).json({ message: 'Error fetching flights' });
//   }
// };
export const getAllFlights=(req:Request,res:Response)=>{
  try {
    res.status(200).json("here is flights");
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Error fetching flights' });
  }
};

export const getFlightById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flight = await Flight.findByPk(id);
    
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    
    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ message: 'Error fetching flight' });
  }
};

export const searchFlights = async (req: Request, res: Response) => {
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
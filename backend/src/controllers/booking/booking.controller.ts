import { Request, Response } from 'express';
import Booking from '../../models/booking.js';
import Flight from '../../models/flight.js';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { flightId, seats } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if flight exists
    const flight = await Flight.findByPk(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Create booking
    const booking = await Booking.create({
      userId,
      flightId,
      seats,
      status: 'pending'
    });
    console.log('Booking created:', booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const bookings = await Booking.findAll({
      where: { userId },
      include: [{ model: Flight }]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findOne({
      where: { id, userId },
      include: [{ model: Flight }]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updateData = req.body;

    const booking = await Booking.findOne({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update(updateData);
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findOne({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({ status: 'cancelled' });
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const bookings = await Booking.findAll({
      where: { userId },
      include: [{ model: Flight }]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
};

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { paymentDetails } = req.body;

    const booking = await Booking.findOne({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // TODO: Implement payment processing logic
    await booking.update({ status: 'paid' });
    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findOne({
      where: { id, userId, status: 'paid' }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not paid' });
    }

    await booking.update({ status: 'confirmed' });
    res.json({ message: 'Booking confirmed successfully' });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Error confirming booking' });
  }
}; 
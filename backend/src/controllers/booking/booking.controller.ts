import { Request, Response } from 'express';
import Booking from '../../models/booking.js';
import Flight from '../../models/flight.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any // Type assertion to bypass the version check
});

interface CreateBookingBody {
  flightId: number;
  passengerName: string;
  passengerEmail: string;
  numberOfSeats: number;
  totalPrice: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  classType?: 'Economy' | 'Business Class' | 'First Class';
}

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { 
      flightId, 
      passengerName, 
      passengerEmail, 
      numberOfSeats, 
      totalPrice, 
      status,
      classType = 'Economy'
    } = req.body as CreateBookingBody;
    
    const userId = req.user?.id;
    
    console.log('userId------------------');
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if flight exists
    const flight = await Flight.findByPk(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Create booking with all required fields
    const booking = await Booking.create({
      userId,
      flightId,
      passengerName,
      passengerEmail,
      numberOfSeats,
      totalPrice,
      status: status || 'pending',
      classType,
      flightName: flight.flightName || `Flight ${flight.flightNumber}`
    } as unknown as Booking);

    console.log('Booking created:', booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      message: 'Error creating booking',
      error: errorMessage,
      details: error instanceof Error ? error.toString() : 'Unknown error'
    });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ 
        model: Flight,
        attributes: ['flightNumber', 'flightName', 'departureAirport', 'arrivalAirport', 'departureTime', 'arrivalTime', 'price']
      }],
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
      include: [{ 
        model: Flight,
        attributes: ['flightNumber', 'flightName', 'departureAirport', 'arrivalAirport', 'departureTime', 'arrivalTime', 'price']
      }]
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
    console.log('Booking cancelled successfully');
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log('userId------------------', userId);
    // Check if user is authenticated
    if (!userId) {
      console.log('User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Fetching bookings for user:', userId);

    // Get all bookings with flight details
    const bookings = await Booking.findAll({
      where: { userId },
      include: [{ 
        model: Flight,
        attributes: ['flightNumber', 'flightName', 'departureAirport', 'arrivalAirport', 'departureTime', 'arrivalTime', 'price']
      }],
      order: [['createdAt', 'DESC']] // Most recent bookings first
    });

    console.log('Found bookings:', bookings.length);

    // If no bookings found, return empty array with message
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        message: 'No bookings found for this user',
        bookings: []
      });
    }

    // Return bookings with success message
    console.log('Bookings retrieved successfully----------------------');
    res.json({
      message: 'Bookings retrieved successfully',
      count: bookings.length,
      bookings: bookings
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      message: 'Error fetching user bookings',
      error: errorMessage
    });
  }
};

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { totalPrice } = req.body;

    // Validate amount
    if (!totalPrice || typeof totalPrice !== 'number' || totalPrice <= 0) {
      return res.status(400).json({
        message: 'Invalid amount. Please provide a valid positive number.',
      });
    }

    const booking = await Booking.findOne({
      where: { id, userId, status: 'pending' }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already confirmed' });
    }

    // Convert to smallest currency unit (paise)
    const amountInPaise = Math.round(totalPrice);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: id,
        userId: userId || 'unknown'
      }
    });

    // Return the client secret to the frontend
    await booking.update({ status: 'confirmed'});
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: 'PaymentIntent created successfully',
      paymentIntentId: paymentIntent.id,
      bookingId: id,
      status: 'confirmed'
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      message: 'Failed to create PaymentIntent',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findOne({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not paid' });
    }

    await booking.update({ status: 'confirmed'});
    res.json({ message: 'payment received and booking confirmed successfully' });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Error confirming booking' });
  }
}; 
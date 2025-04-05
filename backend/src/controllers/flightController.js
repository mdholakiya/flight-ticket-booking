import Flight from '../models/flight.js';

export const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    await flight.update(req.body);
    res.json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    await flight.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
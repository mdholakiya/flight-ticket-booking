import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { Flight, FlightSearchParams } from '../types/flight';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const flightService = {
  searchFlights: async (params: FlightSearchParams) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.SEARCH_FLIGHTS, { params });
    return response.data;
  },

  filterFlights: async (params: FlightSearchParams) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.FILTER_FLIGHTS}`, { 
        params: {
          departureAirport: params.departureAirport,
          arrivalAirport: params.arrivalAirport,
          departureTime: params.departureTime,
          returnDate: params.returnDate,
          passengers: params.passengers,
          travelClass: params.travelClass
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in filterFlights:', error);
      throw error;
    }
  },

  getFlightDetails: async (id: string) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.FLIGHT_DETAILS(id));
    return response.data;
  },

  getAllFlights: async () => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.FLIGHTS}`);
    return response.data;
  },
}; 
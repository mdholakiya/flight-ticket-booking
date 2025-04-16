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

  searchAirports: async (query: string) => {
    try {
      // First try to get suggestions from the flights database
      const flightResponse = await api.get(`${API_CONFIG.ENDPOINTS.FLIGHTS}`, {
        params: { 
          search: query,
          fields: ['departureAirport', 'arrivalAirport']
        }
      });

      if (flightResponse.data && Array.isArray(flightResponse.data)) {
        // Extract unique airports from flight data
        const airports = new Set();
        flightResponse.data.forEach((flight: any) => {
          if (flight.departureAirport?.toLowerCase().includes(query.toLowerCase())) {
            airports.add({ city: flight.departureAirport, code: flight.departureCode });
          }
          if (flight.arrivalAirport?.toLowerCase().includes(query.toLowerCase())) {
            airports.add({ city: flight.arrivalAirport, code: flight.arrivalCode });
          }
        });
        
        const suggestions = Array.from(airports);
        if (suggestions.length > 0) {
          return suggestions;
        }
      }

      // If no flights found or error, try the airports API
      const response = await api.get(`${API_CONFIG.ENDPOINTS.SEARCH_AIRPORTS}`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching airports:', error);
      // Fallback mock data
      return [
        { city: 'New York (JFK)', code: 'JFK' },
        { city: 'New York (LGA)', code: 'LGA' },
        { city: 'Newark (EWR)', code: 'EWR' },
        { city: 'London (LHR)', code: 'LHR' },
        { city: 'London (LGW)', code: 'LGW' },
        { city: 'Paris (CDG)', code: 'CDG' },
        { city: 'Dubai (DXB)', code: 'DXB' },
        { city: 'Singapore (SIN)', code: 'SIN' },
        { city: 'Tokyo (NRT)', code: 'NRT' },
        { city: 'Hong Kong (HKG)', code: 'HKG' }
      ].filter(airport => 
        airport.city.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
}; 
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { Flight, FlightSearchParams } from '../types/flight';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});


export const flightService = {
  searchFlights: async (params: FlightSearchParams) => {
    const response = await api.get( API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.SEARCH_FLIGHTS, { params });
    console.log(response.data);
    return response.data;
  },
  filterFlights: async (params: FlightSearchParams) => {
    const response = await api.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILTER_FLIGHTS}`, { params });
    return response.data;
  },

  getFlightDetails: async (id: string) => {
    const response = await api.get(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.FLIGHT_DETAILS(id));
    return response.data;
  },

  getAllFlights: async () => {
    const response = await api.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FLIGHTS}`);
    return response.data;
  },
}; 
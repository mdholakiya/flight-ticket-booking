interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

export interface FlightSearchParams {
  departureCity?: string;
  arrivalCity?: string;
  departureDate?: string;
  passengers?: number;
}

export default Flight; 
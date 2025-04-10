export interface FlightSearchParams {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  passengers: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
} 
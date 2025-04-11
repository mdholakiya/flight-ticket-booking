export interface FlightSearchParams {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  passengers: number;
  priceRange?: [number, number];
  airlines?: string[];
  sortBy?: 'price' | 'duration' | null;
  travelClass?: string;
  returnDate?: string;
  flights?: Flight[];
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  duration?: string;
} 
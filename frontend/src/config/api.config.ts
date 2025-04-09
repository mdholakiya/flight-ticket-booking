export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/api/v1',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    
    // User
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    REQUEST_OTP: '/users/request-otp',
    RESET_PASSWORD: '/users/change-password',
    
    // Flights
    FLIGHTS: '/flights',
    SEARCH_FLIGHTS: '/flights/search',
    FLIGHT_DETAILS: (id: string) => `/flights/${id}`,
    
    // Bookings
    BOOKINGS: '/bookings',
    USER_BOOKINGS: (userId: string) => `/bookings/user/${userId}`,
    BOOKING_DETAILS: (id: string) => `/bookings/${id}`,
    CANCEL_BOOKING: (id: string) => `/bookings/${id}`,
    PROCESS_PAYMENT: (id: string) => `/bookings/${id}/payment`,
    CONFIRM_BOOKING: (id: string) => `/bookings/${id}/confirm`,
  },
  TOKEN_KEY: 'flight_booking_token',
}; 
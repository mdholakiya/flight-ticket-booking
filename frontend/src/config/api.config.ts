export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/api/v1',
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
    // CURRENT_USER: '/users/current-user',
    // CHECK_USER: '/users/check-user',
    
    // Flights
    FLIGHTS: '/flights/flights',
    SEARCH_FLIGHTS: '/flights/flights/search',
    FILTER_FLIGHTS: '/flights/flights/filter',
    FLIGHT_DETAILS: (id: string) => `/flights/flights/${id}`,
    SEARCH_AIRPORTS: '/flights/airports/search',
    
    // Bookings
    ALL_BOOKINGS: '/bookings/bookings',
    CREATE_BOOKING: '/bookings/bookings',
    CANCEL_BOOKING: (id: string) => `/bookings/bookings/${id}`,
    BOOKING_DETAILS: (id: string) => `/bookings/bookings/${id}`,
    UPDATE_BOOKING: (id: string) => `/bookings/bookings/${id}`,
    // User bookings
    USER_BOOKINGS:  `/bookings/bookings`,
    // CONFIRM_PAYMENT: (id: string) => `/bookings/bookings/${id}/confirm`,
    
    // Payment endpoints
    // CREATE_PAYMENT_INTENT: (bookingId: string) => `/bookings/bookings/${bookingId}/payment-intent`,
    PROCESS_PAYMENT: (bookingId: string) => `/bookings/bookings/${bookingId}/payment`,
    CONFIRM_BOOKING: (id: string) => `/bookings/bookings/${id}/confirm`,
  },
  TOKEN_KEY:'flight_booking_token',
}; 
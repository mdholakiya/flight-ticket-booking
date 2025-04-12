export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/api/v1',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    
    // User
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/update-profile',
    REQUEST_OTP: '/auth/request-otp',
    RESET_PASSWORD: '/auth/reset-password',
    CURRENT_USER: '/auth/current-user',
    CHECK_USER: '/auth/check-user',
    
    // Flights
    FLIGHTS: '/flights',
    SEARCH_FLIGHTS: '/flights/search',
    FILTER_FLIGHTS: '/flights/filter',
    FLIGHT_DETAILS: (id: string) => `/flights/${id}`,
    
    // Bookings
    BOOKINGS: '/bookings',
    USER_BOOKINGS: (userId: string) => `bookings/bookings/${userId}`,
    BOOKING_DETAILS: (id: string) => `/bookings/${id}`,
    CANCEL_BOOKING: (id: string) => `/bookings/${id}/cancel`,
    CONFIRM_BOOKING: (id: string) => `/bookings/bookings/${id}/confirm`,
    
    // Payment endpoints
    CREATE_PAYMENT_INTENT: (bookingId: string) => `/bookings/bookings/${bookingId}/payment-intent`,
    PROCESS_PAYMENT: (bookingId: string) => `/bookings/bookings/${bookingId}/payment`,
  },
  TOKEN_KEY: 'flight_booking_token',
}; 
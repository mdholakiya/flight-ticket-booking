import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlightSearch from './components/Flightfilter';
import { FlightSearchParams } from './types/flight';
import FlightsPage from './app/flights/page';
import '@/styles/globals.css'

// Wrapper component to handle flight search
function FlightSearchWrapper() {
  const navigate = useNavigate();
  
  const handleSearch = (params: FlightSearchParams) => {
    // Navigate to flights page with search params
    navigate('/flights', { state: { searchParams: params } });
  };
  
  return <FlightSearch 
    onSearch={handleSearch}
    searchParams={{
      departureAirport: '',
      arrivalAirport: '',
      departureDate: '',
      passengers: 1,
      travelClass: 'Economy',
      isRoundTrip: false
    }}
  />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<FlightSearchWrapper />} />
              <Route path="/flights" element={<FlightsPage />} />
            </Routes>
          </main>
          <Footer />
        </Layout>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App; 
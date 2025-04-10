import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlightList from './components/FlightList';
import FlightSearch from './components/FlightSearch';
import { FlightSearchParams } from './types/flight';
import '@/styles/globals.css'



// Wrapper component to handle flight search
function FlightSearchWrapper() {
  const navigate = useNavigate();
  
  const handleSearch = (params: FlightSearchParams) => {
    // In a real app, you would fetch flights from an API
    // For now, we'll just navigate to the flights page
    navigate('/flights');
  };
  
  return <FlightSearch onSearch={handleSearch} />;
}

// Wrapper component to handle flight list
function FlightListWrapper() {
  // In a real app, you would fetch flights from an API
  // For now, we'll use dummy data
  const dummyFlights = [
    {
      id: '1',
      airline: 'AirLink',
      flightNumber: 'AL101',
      departureCity: 'New York',
      arrivalCity: 'London',
      departureTime: '10:00 AM',
      arrivalTime: '2:00 PM',
      price: 450,
      availableSeats: 42
    },
    {
      id: '2',
      airline: 'SkyWings',
      flightNumber: 'SW202',
      departureCity: 'London',
      arrivalCity: 'Paris',
      departureTime: '3:30 PM',
      arrivalTime: '5:30 PM',
      price: 180,
      availableSeats: 15
    }
  ];
  
  return <FlightList flights={dummyFlights} />;
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
              <Route path="/flights" element={<FlightListWrapper />} />
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
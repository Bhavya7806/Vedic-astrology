import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import FutureDashboard from './components/FutureDashboard/FutureDashboard';
import Dasha from './components/Dasha/Dasha'; 
import Career from './components/Career/Career'; 
import Love from './components/Love/Love'; 
import Academics from './components/Academics/Academics'; // 1. IMPORT IT
import Health from './components/Health/Health'; 
import Daily from './components/Daily/Daily';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<FutureDashboard />} />
          <Route path="/dashboard/dasha" element={<Dasha />} /> 
          <Route path="/dashboard/career" element={<Career />} /> 
          <Route path="/dashboard/love" element={<Love />} /> 
          <Route path="/dashboard/health" element={<Health />} /> 
<Route path="/dashboard/daily" element={<Daily />} />
          {/* 2. ADD THE ROUTE */}
          <Route path="/dashboard/academics" element={<Academics />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './FutureDashboard.css';

const FutureDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // If someone tries to access this page without logging in, send them home
  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="future-dashboard-page">
      <Navbar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome to Your Future, {currentUser.displayName || 'Seeker'}</h1>
        <p className="dashboard-subtitle">Select an area of your life to explore upcoming cosmic influences.</p>

        <div className="prediction-modules">
          <div className="module-card">
            <h3>💼 Career & Wealth</h3>
            <p>Analyze your 10th and 2nd houses for upcoming professional shifts.</p>
            <button className="btn-module" onClick={() => navigate('/dashboard/career')}>
  Explore Career
</button>
          </div>
          
          <div className="module-card">
            <h3>❤️ Love & Marriage</h3>
            <p>Look into the 7th house and Venus transits for relationship timing.</p>
           
<button className="btn-module" onClick={() => navigate('/dashboard/love')}>
  Explore Love
</button>
          </div>

          <div className="module-card">
            <h3>📚 Academic & Growth</h3>
            <p>Check your 5th and 9th houses for educational success and hidden talents.</p>
            <button className="btn-module" onClick={() => navigate('/dashboard/academics')}>
  Explore Academics
</button>
          </div>

          <div className="module-card">
            <h3>⏳ Current Dasha</h3>
            <p>Discover which planetary period is ruling your life right now.</p>
            <button className="btn-module" onClick={() => navigate('/dashboard/dasha')}>
  Check Dasha
</button>
          </div>
          <div className="module-card">
            <h3>🌿 Health & Vitality</h3>
            <p>Decode your 6th house for physical well-being and lifestyle guidance.</p>
            <button className="btn-module" onClick={() => navigate('/dashboard/health')}>Check Health</button>
          </div>

          <div className="module-card">
            <h3>📅 Today's Energy</h3>
            <p>Your real-time daily cosmic weather and compatibility score.</p>
            <button className="btn-module" onClick={() => navigate('/dashboard/daily')}>Read Daily Forecast</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureDashboard;
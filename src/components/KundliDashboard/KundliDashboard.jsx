import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './KundliDashboard.css';

const KundliDashboard = ({ chartData, trustFacts }) => {
  const [ratings, setRatings] = useState(Array(5).fill(0));
  const [showAccuracy, setShowAccuracy] = useState(false);
  const navigate = useNavigate(); // Initialize the router navigation

  // Check if all 5 facts have been rated
  const allRated = ratings.length === 5 && ratings.every(r => r > 0);

  const handleRating = (index, value) => {
    const newRatings = [...ratings];
    newRatings[index] = value;
    setRatings(newRatings);
  };

  const calculateAccuracy = () => {
    setShowAccuracy(true);
  };

  const totalScore = ratings.reduce((a, b) => a + b, 0);
  const accuracyPercent = Math.round((totalScore / 25) * 100);

  // --- KUNDLI MAPPING LOGIC ---
  
  // 1. Map signs to numbers (Aries = 1, Taurus = 2, etc.)
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  
  // 2. Find the Ascendant (1st House) sign index
  const lagnaSign = chartData?.lagna?.sign || "Aries";
  const lagnaIndex = signs.indexOf(lagnaSign);

  // 3. Group planets by the house they belong in
  const houses = Array(12).fill().map(() => []);
  
  if (chartData?.planets) {
    chartData.planets.forEach(planet => {
      const planetSignIndex = signs.indexOf(planet.sign);
      // Calculate which house this sign falls into relative to Lagna
      let houseIndex = (planetSignIndex - lagnaIndex + 12) % 12;
      
      // Add the first 2 letters of the planet's name (e.g., "SU" for Sun)
      houses[houseIndex].push(planet.name.substring(0, 2).toUpperCase()); 
    });
  }

  // 4. Exact SVG (x, y) coordinates for the 12 houses in a North Indian Chart
  const houseCoords = [
    { x: 200, y: 110 }, // House 1 (Top Center Diamond)
    { x: 90,  y: 60 },  // House 2 (Top Left Triangle)
    { x: 60,  y: 90 },  // House 3 (Bottom Left Triangle - Upper)
    { x: 110, y: 200 }, // House 4 (Left Center Diamond)
    { x: 60,  y: 310 }, // House 5 (Bottom Left Triangle - Lower)
    { x: 90,  y: 340 }, // House 6 (Bottom Right Triangle - Lower)
    { x: 200, y: 290 }, // House 7 (Bottom Center Diamond)
    { x: 310, y: 340 }, // House 8 (Bottom Right Triangle - Upper)
    { x: 340, y: 310 }, // House 9 (Top Right Triangle - Lower)
    { x: 290, y: 200 }, // House 10 (Right Center Diamond)
    { x: 340, y: 90 },  // House 11 (Top Right Triangle - Upper)
    { x: 310, y: 60 },  // House 12 (Top Left Triangle - Right side)
  ];

  return (
    <div className="kundli-dashboard">
      <div className="dashboard-header">
        <h2>Your Cosmic Blueprint</h2>
        <p>Calculated using precise astronomical ephemeris data.</p>
      </div>

      <div className="chart-container">
        <svg viewBox="0 0 400 400" className="vedic-chart">
          {/* Outer Box */}
          <rect x="10" y="10" width="380" height="380" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
          {/* Diagonal Crosses */}
          <line x1="10" y1="10" x2="390" y2="390" stroke="var(--color-gold)" strokeWidth="1" />
          <line x1="390" y1="10" x2="10" y2="390" stroke="var(--color-gold)" strokeWidth="1" />
          {/* Inner Diamond */}
          <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
          
          {/* Render the Planets into their respective houses */}
          {houseCoords.map((coord, index) => {
            // Calculate the actual Zodiac sign number for this house (1-12)
            const signNumber = ((lagnaIndex + index) % 12) + 1;
            
            return (
              <g key={index}>
                {/* Small Zodiac Sign Number */}
                <text x={coord.x} y={coord.y - 15} textAnchor="middle" fill="var(--color-saffron)" fontSize="10" opacity="0.7">
                  {signNumber}
                </text>
                
                {/* Planets in this house */}
                <text x={coord.x} y={coord.y + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                  {houses[index].join(", ")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* The Trust Engine Section */}
      <div className="trust-engine-section">
        <h3 className="trust-title">Validating Your Timeline</h3>
        <p className="trust-subtitle">
          Before we look to the future, we must verify the past. Rate the accuracy of these astrological events from your life.
        </p>

        <div className="facts-list">
          {trustFacts?.map((fact, index) => (
            <div className="fact-card" key={index}>
              <p className="fact-text">{fact}</p>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star}
                    className={`star ${ratings[index] >= star ? 'active' : ''}`}
                    onClick={() => handleRating(index, star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!showAccuracy ? (
          <button 
            className={`btn-calculate-accuracy ${allRated ? 'ready' : 'disabled'}`}
            onClick={calculateAccuracy}
            disabled={!allRated}
          >
            {allRated ? 'Calculate Chart Accuracy' : 'Rate all events to unlock future predictions'}
          </button>
        ) : (
          <div className="accuracy-result slide-up">
            <h3>System Accuracy: <span className="highlight-percent">{accuracyPercent}%</span></h3>
            <p>Your timeline is strongly aligned. The cosmos are ready to reveal what lies ahead.</p>
            
            {/* The button now navigates to the new FutureDashboard page */}
            <button 
              className="btn-predict-future"
              onClick={() => navigate('/dashboard')}
            >
              Unlock Future Predictions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KundliDashboard;
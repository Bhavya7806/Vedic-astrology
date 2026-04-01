import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../Navbar/Navbar';
import './Dasha.css';

const Dasha = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [dashaInfo, setDashaInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchChartAndCalculate = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid, "savedCharts", "primaryChart");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const moon = data.astrologyData.planets.find(p => p.name === 'Moon');
          
          if (moon) {
            const calculatedDasha = calculateVimshottariDasha(moon.absoluteDegree, data.birthDetails.date);
            setDashaInfo(calculatedDasha);
          } else {
            setError("Moon data missing from chart.");
          }
        } else {
          setError("No saved chart found. Please generate your chart first.");
        }
      } catch (err) {
        console.error("Error fetching chart:", err);
        setError("Failed to load cosmic data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartAndCalculate();
  }, [currentUser, navigate]);

  // --- THE VIMSHOTTARI DASHA & ANTARDASHA MATH ENGINE ---
  const calculateVimshottariDasha = (moonDegree, birthDateStr) => {
    const dashaLords = [
      { name: 'Ketu', years: 7, theme: 'Spiritual isolation, detachment, sudden insights, and breaking illusions.' },
      { name: 'Venus', years: 20, theme: 'Focus on relationships, wealth, luxury, creativity, and worldly comforts.' },
      { name: 'Sun', years: 6, theme: 'Ego development, career advancement, authority, and finding your soul purpose.' },
      { name: 'Moon', years: 10, theme: 'Deep emotional shifts, focus on home, mother, and mental realignments.' },
      { name: 'Mars', years: 7, theme: 'High energy, courage, potential conflicts, ambition, and taking direct action.' },
      { name: 'Rahu', years: 18, theme: 'Intense material desires, worldly success, confusion, and massive ambition.' },
      { name: 'Jupiter', years: 16, theme: 'Period of wisdom, spiritual expansion, financial growth, and higher learning.' },
      { name: 'Saturn', years: 19, theme: 'Hard work, discipline, delays, karmic lessons, and building a solid foundation.' },
      { name: 'Mercury', years: 17, theme: 'Focus on intellect, communication, business, learning, and analytical skills.' }
    ];

    const nakshatraLength = 360 / 27; 
    const exactNakshatra = moonDegree / nakshatraLength;
    const nakshatraIndex = Math.floor(exactNakshatra);
    
    const fractionTraversed = exactNakshatra - nakshatraIndex;
    const fractionRemaining = 1 - fractionTraversed;

    let currentLordIndex = nakshatraIndex % 9;
    let dashaStart = new Date(birthDateStr);
    
    let firstDashaRemainingYears = dashaLords[currentLordIndex].years * fractionRemaining;
    let dashaEnd = new Date(dashaStart.getTime() + firstDashaRemainingYears * 365.25 * 24 * 60 * 60 * 1000);

    const now = new Date();

    // Find the CURRENT Mahadasha
    while (now > dashaEnd) {
      dashaStart = new Date(dashaEnd);
      currentLordIndex = (currentLordIndex + 1) % 9;
      let nextDashaYears = dashaLords[currentLordIndex].years;
      dashaEnd = new Date(dashaStart.getTime() + nextDashaYears * 365.25 * 24 * 60 * 60 * 1000);
    }

    const mainLord = dashaLords[currentLordIndex];

    // --- CALCULATE ANTARDASHAS (SUB-PERIODS) ---
    const subPeriods = [];
    let currentSubStart = new Date(dashaStart);

    // Sub-periods always start with the Main Lord, then cycle through the rest
    for (let i = 0; i < 9; i++) {
      let subLordIndex = (currentLordIndex + i) % 9;
      let subLord = dashaLords[subLordIndex];

      // Astrological Formula for Sub-Period Length: (Main Years * Sub Years) / 120
      let subDurationYears = (mainLord.years * subLord.years) / 120;
      let subDurationMs = subDurationYears * 365.25 * 24 * 60 * 60 * 1000;
      let currentSubEnd = new Date(currentSubStart.getTime() + subDurationMs);

      // Simple prediction generator based on combining planet energies
      const generateSubPrediction = (main, sub) => {
        if (main === sub) return `Intense focus on the core themes of ${main}. A powerful time of initiating new cycles in this phase.`;
        
        const keywords = {
          Sun: "career advancement, dealing with authority, and ego development",
          Moon: "emotional shifts, home life, and inner peace",
          Mars: "bold actions, high physical energy, and overcoming obstacles",
          Rahu: "unexpected changes, foreign influences, and sudden desires",
          Jupiter: "financial growth, wisdom, and finding mentors",
          Saturn: "hard work, restructuring routines, and learning discipline",
          Mercury: "business opportunities, communication, and learning new skills",
          Ketu: "detachment, spiritual insights, and letting go of what no longer serves you",
          Venus: "relationships, seeking comfort, luxury, and creative pursuits"
        };
        
        return `The overarching energy of ${main} blends with ${sub}. During these specific months, expect developments regarding ${keywords[sub]}.`;
      };

      subPeriods.push({
        lord: subLord.name,
        startDate: currentSubStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        endDate: currentSubEnd.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        isActive: now >= currentSubStart && now <= currentSubEnd,
        prediction: generateSubPrediction(mainLord.name, subLord.name)
      });

      currentSubStart = new Date(currentSubEnd); // Next sub-period starts when this one ends
    }

    return {
      planet: mainLord.name,
      startYear: dashaStart.getFullYear(),
      endYear: dashaEnd.getFullYear(),
      theme: mainLord.theme,
      totalYears: mainLord.years,
      subPeriods: subPeriods // Return the timeline
    };
  };

  if (loading) {
    return (
      <div className="dasha-page">
        <Navbar />
        <div className="premium-loader-container">
          <div className="cosmic-clock-loader">
            <div className="clock-outer"></div>
            <div className="clock-inner"></div>
            <div className="clock-center"></div>
          </div>
          <h3 className="loader-title dasha-title">Reading Celestial Timeline...</h3>
          <p className="loader-subtitle">Calculating Vimshottari Mahadasha periods</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dasha-page">
      <Navbar />
      <div className="dasha-container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        {error ? (
          <div className="error-banner">{error}</div>
        ) : (
          <div className="dasha-content">
            <div className="dasha-header">
              <h2>Your Current Timeline</h2>
              <p>Based on the Vimshottari Dasha system</p>
            </div>

            {/* Main Period Card */}
            <div className="active-dasha-card">
              <h3 className="dasha-planet">{dashaInfo?.planet} Mahadasha</h3>
              <div className="dasha-timeline-main">
                <span className="year">{dashaInfo?.startYear}</span>
                <div className="timeline-line"></div>
                <span className="year">{dashaInfo?.endYear}</span>
              </div>
              <p className="dasha-duration">A {dashaInfo?.totalYears}-year overarching cosmic cycle</p>
              
              <div className="dasha-theme">
                <h4>Core Theme:</h4>
                <p>{dashaInfo?.theme}</p>
              </div>
            </div>
            
            {/* Sub-Periods Timeline */}
            <div className="sub-periods-section">
              <h3>Detailed Sub-Periods (Antardasha)</h3>
              <p className="sub-subtitle">How the {dashaInfo?.planet} period breaks down over time.</p>
              
              <div className="timeline-wrapper">
                {dashaInfo?.subPeriods.map((sub, index) => (
                  <div key={index} className={`timeline-item ${sub.isActive ? 'active-sub' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-dates">
                        {sub.startDate} — {sub.endDate}
                      </div>
                      <h4 className="timeline-title">
                        {dashaInfo.planet} - {sub.lord} Period 
                        {sub.isActive && <span className="active-badge">CURRENT</span>}
                      </h4>
                      <p className="timeline-prediction">{sub.prediction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dasha;
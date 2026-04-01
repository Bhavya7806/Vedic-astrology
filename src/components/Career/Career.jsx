import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../Navbar/Navbar';
import './Career.css';

const Career = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [careerProfile, setCareerProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchChartAndAnalyze = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid, "savedCharts", "primaryChart");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Pass both astrology data and birth date for timeline math
          const analysis = analyzeCareer(data.astrologyData, data.birthDetails.date);
          setCareerProfile(analysis);
        } else {
          setError("No saved chart found. Please generate your chart first.");
        }
      } catch (err) {
        console.error("Error fetching chart:", err);
        setError("Failed to load cosmic career data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartAndAnalyze();
  }, [currentUser, navigate]);

  // --- THE CAREER, WEALTH & TIMING MATH ENGINE ---
  const analyzeCareer = (chartData, birthDateStr) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    
    // Rulers of each Zodiac sign
    const signRulers = {
      "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
      "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
      "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    };
    
    // 1. Calculate Houses
    const lagnaIndex = signs.indexOf(chartData.lagna.sign);
    const tenthHouseSign = signs[(lagnaIndex + 9) % 12]; // 10th House (Career)
    const secondHouseSign = signs[(lagnaIndex + 1) % 12]; // 2nd House (Wealth)
    const eleventhHouseSign = signs[(lagnaIndex + 10) % 12]; // 11th House (Gains/Network)

    // 2. Identify "Power Planets" (The Lords)
    const careerLord = signRulers[tenthHouseSign];
    const wealthLord = signRulers[secondHouseSign];
    const gainsLord = signRulers[eleventhHouseSign];

    // 3. Expanded Career Archetypes (More specific suitable careers)
    const careerRoles = {
      "Aries": ["Startup Founder", "Military/Police Officer", "Surgeon", "Mechanical Engineer"],
      "Taurus": ["Financial Advisor", "Real Estate Developer", "Chef/Restaurateur", "Art Director"],
      "Gemini": ["Journalist", "Software Developer", "Sales Executive", "Marketing Strategist"],
      "Cancer": ["Healthcare Administrator", "HR Director", "Psychologist", "Hotel Manager"],
      "Leo": ["CEO/Executive", "Politician", "Entertainment Director", "Brand Ambassador"],
      "Virgo": ["Data Scientist", "Accountant", "Medical Researcher", "Systems Analyst"],
      "Libra": ["Corporate Lawyer", "Diplomat", "Architect", "Public Relations Executive"],
      "Scorpio": ["Cybersecurity Expert", "Investigative Researcher", "Psychiatrist", "Crisis Manager"],
      "Sagittarius": ["University Professor", "International Trade", "Lawyer", "Travel Entrepreneur"],
      "Capricorn": ["Corporate Manager", "Civil Engineer", "Government Official", "Operations Director"],
      "Aquarius": ["Tech Innovator", "Non-Profit Director", "AI Researcher", "Social Media Founder"],
      "Pisces": ["Creative Director", "Therapist", "Marine Biologist", "Spiritual Guide"]
    };

    // 4. TIMELINE MATH (When will success happen?)
    // We calculate Dasha periods and filter for the Power Planets
    const moon = chartData.planets.find(p => p.name === 'Moon');
    let powerPeriods = [];
    
    if (moon) {
      const dashaLords = [
        { name: 'Ketu', years: 7 }, { name: 'Venus', years: 20 }, { name: 'Sun', years: 6 },
        { name: 'Moon', years: 10 }, { name: 'Mars', years: 7 }, { name: 'Rahu', years: 18 },
        { name: 'Jupiter', years: 16 }, { name: 'Saturn', years: 19 }, { name: 'Mercury', years: 17 }
      ];

      const nakshatraLength = 360 / 27; 
      let exactNakshatra = moon.absoluteDegree / nakshatraLength;
      let currentLordIndex = Math.floor(exactNakshatra) % 9;
      let fractionRemaining = 1 - (exactNakshatra - Math.floor(exactNakshatra));
      
      let dashaStart = new Date(birthDateStr);
      let dashaEnd = new Date(dashaStart.getTime() + (dashaLords[currentLordIndex].years * fractionRemaining * 365.25 * 24 * 60 * 60 * 1000));
      
      const now = new Date();
      let yearLimit = now.getFullYear() + 30; // Look ahead 30 years
      
      while (dashaStart.getFullYear() < yearLimit) {
        let lordName = dashaLords[currentLordIndex].name;
        
        // If this period is ruled by a career or wealth planet, save it!
        if ([careerLord, wealthLord, gainsLord].includes(lordName)) {
           // Only add periods that are in the future or currently active
           if (dashaEnd > now) {
             let focus = [];
             if (lordName === careerLord) focus.push("Career Peak & Status Elevation");
             if (lordName === wealthLord) focus.push("Major Wealth Accumulation");
             if (lordName === gainsLord) focus.push("Sudden Windfalls & Network Expansion");
             
             powerPeriods.push({
               planet: lordName,
               startYear: dashaStart.getFullYear(),
               endYear: dashaEnd.getFullYear(),
               focus: focus.join(" & "),
               isActive: now >= dashaStart && now <= dashaEnd
             });
           }
        }
        
        dashaStart = new Date(dashaEnd);
        currentLordIndex = (currentLordIndex + 1) % 9;
        dashaEnd = new Date(dashaStart.getTime() + (dashaLords[currentLordIndex].years * 365.25 * 24 * 60 * 60 * 1000));
      }
    }

    // Sort periods chronologically
    powerPeriods.sort((a, b) => a.startYear - b.startYear);
    // Take the next 3 major periods
    powerPeriods = powerPeriods.slice(0, 3);

    return {
      tenthSign: tenthHouseSign,
      careerLord: careerLord,
      roles: careerRoles[tenthHouseSign],
      wealthLord: wealthLord,
      gainsLord: gainsLord,
      powerPeriods: powerPeriods
    };
  };

  if (loading) {
    return (
      <div className="career-page">
        <Navbar />
        <div className="premium-loader-container">
          <div className="karma-ascension-loader">
            <div className="step step-1"></div>
            <div className="step step-2"></div>
            <div className="step step-3"></div>
            <div className="step step-4"></div>
          </div>
          <h3 className="loader-title career-title">Analyzing Career Trajectory...</h3>
          <p className="loader-subtitle">Decoding 10th and 2nd House potentials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="career-page">
      <Navbar />
      <div className="career-container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        {error ? (
          <div className="error-banner">{error}</div>
        ) : (
          <div className="career-content">
            <div className="career-header">
              <h2>Career & Wealth Blueprint</h2>
              <p>Your astrological map to professional success</p>
            </div>

            <div className="career-grid">
              {/* Profile Card */}
              <div className="astrology-card primary-card">
                <div className="card-icon">🎯</div>
                <h3>Your Professional DNA</h3>
                <p className="prediction-text">
                  Your 10th House of Career is in <strong>{careerProfile?.tenthSign}</strong>, making <strong>{careerProfile?.careerLord}</strong> the ultimate CEO of your professional life. 
                </p>
                
                <h4 className="roles-title">Highly Suitable Career Paths:</h4>
                <div className="roles-grid">
                  {careerProfile?.roles.map((role, idx) => (
                    <div key={idx} className="role-tag">{role}</div>
                  ))}
                </div>
                
                <div className="wealth-insight">
                  <h4>Wealth & Windfalls</h4>
                  <p>Your primary wealth accumulation is driven by <strong>{careerProfile?.wealthLord}</strong>, while sudden gains and bonuses are controlled by <strong>{careerProfile?.gainsLord}</strong>. When these planets are active, your financial status upgrades.</p>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="astrology-card timeline-card">
                <div className="card-icon">⏳</div>
                <h3>Timeline of Success</h3>
                <p className="timeline-desc">These are your upcoming cosmic "Power Periods" where your career and wealth lords are fully activated.</p>
                
                <div className="power-periods-list">
                  {careerProfile?.powerPeriods.length > 0 ? (
                    careerProfile.powerPeriods.map((period, idx) => (
                      <div key={idx} className={`power-period-item ${period.isActive ? 'active-power' : ''}`}>
                        <div className="period-years">{period.startYear} — {period.endYear}</div>
                        <div className="period-planet">
                          {period.planet} Period {period.isActive && <span className="active-badge">CURRENT</span>}
                        </div>
                        <div className="period-focus">{period.focus}</div>
                      </div>
                    ))
                  ) : (
                    <p className="no-periods">You are currently in a foundational period. Focus on building skills; major elevations will follow in the next planetary cycle.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Career;
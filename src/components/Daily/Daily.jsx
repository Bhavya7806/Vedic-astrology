import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../Navbar/Navbar';
import './Daily.css';

const Daily = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [dailyForecast, setDailyForecast] = useState(null);
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
          const analysis = generateDailyForecast(data.astrologyData);
          setDailyForecast(analysis);
        } else {
          setError("No saved chart found. Please generate your chart first.");
        }
      } catch (err) {
        console.error("Error fetching chart:", err);
        setError("Failed to load daily forecast.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartAndAnalyze();
  }, [currentUser, navigate]);

  const generateDailyForecast = (chartData) => {
    // 1. Determine Current Day of the Week
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const currentDayName = days[today.getDay()];
    
    // 2. Map Day to its Ruling Planet (Vara)
    const dayLords = {
      "Sunday": "Sun", "Monday": "Moon", "Tuesday": "Mars", 
      "Wednesday": "Mercury", "Thursday": "Jupiter", "Friday": "Venus", "Saturday": "Saturn"
    };
    const todayLord = dayLords[currentDayName];

    // 3. Find User's Ascendant Lord (Lagna Lord)
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const signRulers = {
      "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
      "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
      "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    };
    
    const lagnaSign = chartData.lagna.sign;
    const userLord = signRulers[lagnaSign];

    // 4. Compatibility Matrix (Vedic Friendship Rules)
    const relationships = {
      "Sun": { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
      "Moon": { friends: ["Sun", "Mercury"], enemies: [] },
      "Mars": { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
      "Mercury": { friends: ["Sun", "Venus"], enemies: ["Moon"] },
      "Jupiter": { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
      "Venus": { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
      "Saturn": { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] }
    };

    // 5. Generate Score and Advice
    let score = 70; // Default Neutral
    let status = "Balanced Day";
    let advice = `Today is ruled by ${todayLord}, which is neutral to your ruling planet (${userLord}). Expect a steady, productive day with no major extremes.`;

    if (userLord === todayLord) {
      score = 95;
      status = "Peak Power Day";
      advice = `Today is your day! It is ruled by ${todayLord}, your exact Ascendant lord. Your physical vitality, confidence, and manifesting power are at their absolute peak. Take big risks today.`;
    } else if (relationships[userLord]?.friends.includes(todayLord)) {
      score = 85;
      status = "Highly Favorable";
      advice = `Excellent cosmic weather! ${todayLord} (today's ruler) is great friends with ${userLord} (your ruler). Things will flow easily today. It's a great day for communication and pushing projects forward.`;
    } else if (relationships[userLord]?.enemies.includes(todayLord)) {
      score = 40;
      status = "Friction & Delays";
      advice = `Take it easy today. ${todayLord} naturally clashes with your ruling planet, ${userLord}. You might face communication breakdowns, delays, or people testing your patience. Practice grounding.`;
    }

    // Formatting date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return {
      dateString: today.toLocaleDateString('en-US', dateOptions),
      todayLord: todayLord,
      userLord: userLord,
      score: score,
      status: status,
      advice: advice
    };
  };

  if (loading) {
    return (
      <div className="daily-page">
        <Navbar />
        <div className="premium-loader-container">
          <div className="solar-system-loader">
            <div className="sun-center"></div>
            <div className="planet-orbit">
              <div className="orbiting-planet"></div>
            </div>
          </div>
          <h3 className="loader-title daily-title">Reading Today's Ephemeris...</h3>
          <p className="loader-subtitle daily-subtitle">Aligning real-time cosmic transits</p>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-page">
      <Navbar />
      <div className="daily-container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>

        {error ? ( <div className="error-banner">{error}</div> ) : (
          <div className="daily-content">
            <div className="daily-header">
              <p className="current-date">{dailyForecast?.dateString}</p>
              <h2>Today's Cosmic Energy</h2>
            </div>

            <div className="daily-card">
              <div className="score-ring">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray={`${dailyForecast?.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">{dailyForecast?.score}%</text>
                </svg>
                <h3>{dailyForecast?.status}</h3>
              </div>

              <div className="daily-details">
                <div className="planet-clash">
                  <div className="planet-box">
                    <span>Your Ruler</span>
                    <strong>{dailyForecast?.userLord}</strong>
                  </div>
                  <div className="vs">VS</div>
                  <div className="planet-box">
                    <span>Today's Ruler</span>
                    <strong>{dailyForecast?.todayLord}</strong>
                  </div>
                </div>

                <div className="daily-advice">
                  <p>{dailyForecast?.advice}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Daily;
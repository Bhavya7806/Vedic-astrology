import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../Navbar/Navbar';
import './Health.css';

const Health = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [healthProfile, setHealthProfile] = useState(null);
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
          const analysis = analyzeHealth(data.astrologyData);
          setHealthProfile(analysis);
        } else {
          setError("No saved chart found. Please generate your chart first.");
        }
      } catch (err) {
        console.error("Error fetching chart:", err);
        setError("Failed to load cosmic health data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartAndAnalyze();
  }, [currentUser, navigate]);

  const analyzeHealth = (chartData) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    
    // 1. Calculate 6th House (Health, Diet, Routine)
    const lagnaIndex = signs.indexOf(chartData.lagna.sign);
    const sixthHouseSign = signs[(lagnaIndex + 5) % 12];
    const sixthHousePlanets = chartData.planets.filter(p => p.sign === sixthHouseSign).map(p => p.name);

    // 2. Base Constitution (Ayurvedic Dosha approximation based on Lagna)
    const doshaMap = {
      "Aries": "Pitta (Fire/Water) - High heat, fast metabolism.",
      "Taurus": "Kapha (Earth/Water) - Solid build, slow metabolism.",
      "Gemini": "Vata (Air/Space) - Fast-moving, prone to nervous energy.",
      "Cancer": "Kapha (Earth/Water) - Emotionally sensitive digestion.",
      "Leo": "Pitta (Fire/Water) - Strong vitality, needs to burn energy.",
      "Virgo": "Vata (Air/Space) - Highly sensitive nervous system.",
      "Libra": "Vata/Pitta - Needs absolute balance in diet.",
      "Scorpio": "Pitta (Fire/Water) - Intense internal energy, strong resilience.",
      "Sagittarius": "Pitta/Kapha - Active but prone to overindulgence.",
      "Capricorn": "Vata (Air/Space) - Stiff joints, needs warmth and stretching.",
      "Aquarius": "Vata (Air/Space) - Prone to circulatory and nerve issues.",
      "Pisces": "Kapha (Earth/Water) - Sensitive immune system, absorbs environmental stress."
    };

    // 3. Health Sensitivities (Based on 6th House)
    const healthFocus = {
      "Aries": "Headaches, inflammation, and blood pressure. You need high-intensity workouts to burn off excess stress.",
      "Taurus": "Throat, neck, and thyroid. Be mindful of sugar intake and emotional eating. Weight training suits you.",
      "Gemini": "Nervous system, lungs, and shoulders. You are prone to anxiety and need breathwork (Pranayama) to calm your mind.",
      "Cancer": "Stomach and digestion. Your gut health is directly tied to your emotions. Avoid cold foods.",
      "Leo": "Heart, upper back, and spine. You need regular cardiovascular exercise and plenty of morning sunlight.",
      "Virgo": "Intestines and gut flora. You have a highly sensitive digestive tract. A clean, routine-based diet is mandatory.",
      "Libra": "Kidneys, lower back, and skin. Hydration is your ultimate medicine. Yoga and pilates balance your body.",
      "Scorpio": "Reproductive organs and elimination systems. You benefit from detoxes and deep, transformative exercises.",
      "Sagittarius": "Liver, hips, and thighs. You are prone to over-indulging in rich foods. Outdoor hiking or running is best.",
      "Capricorn": "Bones, joints, and teeth. You must stretch daily and ensure high calcium/mineral intake to prevent stiffness.",
      "Aquarius": "Circulation, ankles, and calves. Keep moving to prevent stagnation in your lower body.",
      "Pisces": "Lymphatic system, feet, and sleep hygiene. You absorb stress easily and require more sleep than most people."
    };

    // 4. Sun Vitality Check
    const sun = chartData.planets.find(p => p.name === 'Sun');
    let vitality = "Standard baseline vitality.";
    if (sun) {
      if (["Aries", "Leo", "Sagittarius"].includes(sun.sign)) vitality = "Excellent natural vitality and quick recovery times.";
      else if (["Taurus", "Virgo", "Capricorn"].includes(sun.sign)) vitality = "Enduring stamina. You don't get sick often, but when you do, it lingers.";
      else if (["Gemini", "Libra", "Aquarius"].includes(sun.sign)) vitality = "Fluctuating energy levels depending on your mental state and environment.";
      else vitality = "Sensitive vitality. You require frequent rest and a peaceful environment to recharge.";
    }

    return {
      dosha: doshaMap[chartData.lagna.sign],
      sixthSign: sixthHouseSign,
      focus: healthFocus[sixthHouseSign],
      vitality: vitality,
      occupants: sixthHousePlanets.length > 0 ? sixthHousePlanets.join(", ") : "Empty (This is good! Indicates fewer chronic issues)."
    };
  };

  if (loading) {
    return (
      <div className="health-page">
        <Navbar />
        <div className="premium-loader-container">
          <div className="health-energy-ring">
            <div className="core-pulse"></div>
          </div>
          <h3 className="loader-title">Consulting Ayur Jyotish...</h3>
          <p className="loader-subtitle">Analyzing your 6th house of vitality</p>
        </div>
      </div>
    );
  }

  return (
    <div className="health-page">
      <Navbar />
      <div className="health-container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>

        {error ? ( <div className="error-banner">{error}</div> ) : (
          <div className="health-content">
            <div className="health-header">
              <h2>Health & Vitality</h2>
              <p>Your cosmic blueprint for physical well-being</p>
            </div>

            <div className="health-grid">
              <div className="astrology-card dosha-card">
                <div className="card-icon">🌿</div>
                <h3>Body Constitution</h3>
                <p className="dosha-text"><strong>Ayurvedic Type:</strong> {healthProfile?.dosha}</p>
                <p className="vitality-text"><strong>Core Vitality (Sun):</strong> {healthProfile?.vitality}</p>
              </div>

              <div className="astrology-card sixth-house-card">
                <div className="card-icon">⚕️</div>
                <h3>The 6th House (Disease & Routine)</h3>
                <div className="badge-row">
                  <span className="badge">Sign: {healthProfile?.sixthSign}</span>
                  <span className="badge">Planets Present: {healthProfile?.occupants}</span>
                </div>
                <div className="focus-area">
                  <h4>Physical Focus & Best Exercise</h4>
                  <p>{healthProfile?.focus}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Health;
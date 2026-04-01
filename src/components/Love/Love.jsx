import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../Navbar/Navbar';
import './Love.css';

const Love = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [loveProfile, setLoveProfile] = useState(null);
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
          const analysis = analyzeLove(data.astrologyData, data.birthDetails.date);
          setLoveProfile(analysis);
        } else {
          setError("No saved chart found. Please generate your chart first.");
        }
      } catch (err) {
        console.error("Error fetching chart:", err);
        setError("Failed to load cosmic love data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartAndAnalyze();
  }, [currentUser, navigate]);

  // --- THE LOVE & MARRIAGE MATH ENGINE ---
  const analyzeLove = (chartData, birthDateStr) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    
    const signRulers = {
      "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
      "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
      "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    };

    // 1. Calculate the 7th House (Marriage)
    const lagnaIndex = signs.indexOf(chartData.lagna.sign);
    const seventhHouseIndex = (lagnaIndex + 6) % 12; // 7th house is 6 steps away from 1st
    const seventhHouseSign = signs[seventhHouseIndex];
    const seventhLordName = signRulers[seventhHouseSign];

    // 2. Find where the 7th Lord is sitting to predict WHERE they meet
    const seventhLordPlanet = chartData.planets.find(p => p.name === seventhLordName);
    let meetingPlace = "through mutual connections or a serendipitous public encounter.";
    
    if (seventhLordPlanet) {
      const lordSignIndex = signs.indexOf(seventhLordPlanet.sign);
      const lordHousePlacement = (lordSignIndex - lagnaIndex + 12) % 12 + 1; // 1 to 12

      const meetingLocations = {
        1: "through self-development activities, personal branding, or childhood friends.",
        2: "at a family gathering, financial institution, or through a family introduction.",
        3: "online (dating apps/social media), through a sibling, or on a short trip.",
        4: "in your hometown, real estate matters, or introduced by a maternal figure.",
        5: "at a university, a party, a creative event, or a place of entertainment.",
        6: "at your workplace, a gym/fitness center, or while doing daily routines.",
        7: "through a business partnership, a direct setup, or public networking.",
        8: "in a completely unexpected, transformative situation, or during research/occult studies.",
        9: "during long-distance travel, at university, or a spiritual/religious gathering.",
        10: "at work, a corporate event, or introduced by a boss/authority figure.",
        11: "through your wider friend circle, networking events, or large social gatherings.",
        12: "in a foreign country, a retreat, a hospital, or an isolated/quiet place."
      };
      meetingPlace = meetingLocations[lordHousePlacement];
    }

    // 3. Partner's Nature & Attitude (Based on 7th House Sign)
    const partnerNature = {
      "Aries": "Fiery, highly independent, athletic, and prone to taking charge. They have a go-getter attitude but can be impulsive.",
      "Taurus": "Stable, romantic, grounded, and financially focused. They value loyalty and luxury but can be quite stubborn.",
      "Gemini": "Witty, highly communicative, intellectual, and playful. They love banter and variety, keeping the relationship youthful.",
      "Cancer": "Deeply emotional, nurturing, and family-oriented. They are protective and intuitive, seeking emotional security above all.",
      "Leo": "Charismatic, generous, and confident. They love to be the center of attention and treat relationships with grand, royal romance.",
      "Virgo": "Analytical, practical, and highly observant. They show love through acts of service and expect high standards.",
      "Libra": "Charming, diplomatic, and aesthetically driven. They thrive on balance, peace, and maintaining a harmonious partnership.",
      "Scorpio": "Intensely passionate, private, and magnetic. They seek absolute loyalty and a deep psychological soul-bond.",
      "Sagittarius": "Adventurous, philosophical, and freedom-loving. They are optimistic, blunt, and always looking for the next big journey.",
      "Capricorn": "Ambitious, serious, and deeply committed. They approach relationships as a long-term investment and value status and stability.",
      "Aquarius": "Unconventional, intellectual, and highly independent. They will feel like a best friend first and romantic partner second.",
      "Pisces": "Dreamy, empathetic, and deeply spiritual. They are incredibly romantic and compassionate, often highly creative or artistic."
    };

    // 4. Starting Letter of Partner's Name (Vedic Phonetics mapped to signs)
    const letters = {
      "Aries": "A, L, or E", "Taurus": "B, V, or U", "Gemini": "K, C, or G", "Cancer": "H, D, or N",
      "Leo": "M or T", "Virgo": "P, S, or T", "Libra": "R or T", "Scorpio": "N or Y",
      "Sagittarius": "B, D, or F", "Capricorn": "J or K", "Aquarius": "G, S, or Sh", "Pisces": "D, C, or Z"
    };

    // 5. Marriage Timing & Age Logic
    const birthYear = new Date(birthDateStr).getFullYear();
    const planetsIn7th = chartData.planets.filter(p => p.sign === seventhHouseSign).map(p => p.name);
    
    let marriageAgeRange = "26 to 28"; // Default standard Vedic age
    let timingDescription = "Your chart indicates a standard timeline for settling down, aligning with your natural emotional maturity.";

    if (planetsIn7th.includes("Saturn") || seventhLordPlanet?.name === "Saturn") {
      marriageAgeRange = "29 to 32+";
      timingDescription = "Saturn's influence delays marriage to ensure absolute stability. Rushing into commitment before your late twenties is not advised; your best relationships come when you are fully mature.";
    } else if (planetsIn7th.includes("Mars") || planetsIn7th.includes("Rahu")) {
      marriageAgeRange = "23 to 26";
      timingDescription = "Mars and Rahu create early, impulsive romantic desires. You are likely to meet someone quickly and passionately, though you must ensure you aren't rushing past red flags.";
    } else if (planetsIn7th.includes("Jupiter")) {
      marriageAgeRange = "25 to 27";
      timingDescription = "Jupiter brings a perfectly timed, highly blessed union, often facilitated by family or mentors.";
    }

    // Calculate approximate year
    const avgAge = parseInt(marriageAgeRange.split(" ")[0]) + 1; 
    const marriageYear = birthYear + avgAge;

    return {
      seventhSign: seventhHouseSign,
      seventhLord: seventhLordName,
      nature: partnerNature[seventhHouseSign],
      letters: letters[seventhHouseSign],
      meetingPlace: meetingPlace,
      ageRange: marriageAgeRange,
      approxYear: marriageYear,
      timingInsight: timingDescription
    };
  };

 if (loading) {
    return (
      <div className="love-page">
        <Navbar />
        <div className="premium-loader-container">
          <div className="twin-flame-loader">
            <div className="flame pink-flame"></div>
            <div className="flame purple-flame"></div>
          </div>
          <h3 className="loader-title love-title">Consulting Venus...</h3>
          <p className="loader-subtitle">Aligning 7th House frequencies</p>
        </div>
      </div>
    );
  }

  return (
    <div className="love-page">
      <Navbar />
      <div className="love-container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        {error ? (
          <div className="error-banner">{error}</div>
        ) : (
          <div className="love-content">
            <div className="love-header">
              <h2>Love & Marriage</h2>
              <p>Decoding your 7th House of Partnerships</p>
            </div>

            <div className="love-grid">
              {/* Partner Profile Card */}
              <div className="astrology-card romance-card">
                <div className="card-icon">💞</div>
                <h3>Your Future Partner</h3>
                
                <div className="love-traits">
                  <div className="trait-box">
                    <span className="trait-label">7th House Sign</span>
                    <span className="trait-value">{loveProfile?.seventhSign}</span>
                  </div>
                  <div className="trait-box">
                    <span className="trait-label">Initials</span>
                    <span className="trait-value">{loveProfile?.letters}</span>
                  </div>
                </div>

                <div className="insight-section">
                  <h4>Nature & Attitude</h4>
                  <p>{loveProfile?.nature}</p>
                </div>
              </div>

              {/* Timing & Location Card */}
              <div className="astrology-card timing-card">
                <div className="card-icon">💍</div>
                <h3>The Meeting & Timing</h3>
                
                <div className="insight-section">
                  <h4>Where You Will Meet</h4>
                  <p>Because your 7th Lord ({loveProfile?.seventhLord}) is positioned specifically in your chart, destiny dictates you are most likely to meet your spouse <strong>{loveProfile?.meetingPlace}</strong>.</p>
                </div>

                <div className="insight-section">
                  <h4>Age of Marriage</h4>
                  <div className="age-display">
                    <span className="age-number">{loveProfile?.ageRange}</span>
                    <span className="age-text">Years Old</span>
                  </div>
                  <p className="timing-text">Estimated Year: <strong>{loveProfile?.approxYear} — {loveProfile?.approxYear + 2}</strong></p>
                  <p>{loveProfile?.timingInsight}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Love;
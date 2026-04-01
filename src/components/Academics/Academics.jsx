import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../Navbar/Navbar';
import './Academics.css';

const Academics = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [academicProfile, setAcademicProfile] = useState(null);
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
          const analysis = analyzeAcademics(data.astrologyData);
          setAcademicProfile(analysis);
        } else {
          setError("No saved chart found. Please generate your chart first.");
        }
      } catch (err) {
        console.error("Error fetching chart:", err);
        setError("Failed to load cosmic academic data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartAndAnalyze();
  }, [currentUser, navigate]);

  // --- THE ACADEMIC & INTELLECT MATH ENGINE ---
  const analyzeAcademics = (chartData) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    
    // 1. Calculate the 5th House (Hidden Talents & Intellect) and 9th House (Higher Education)
    const lagnaIndex = signs.indexOf(chartData.lagna.sign);
    const fifthHouseSign = signs[(lagnaIndex + 4) % 12];
    const ninthHouseSign = signs[(lagnaIndex + 8) % 12];

    // 2. Hidden Talents (Based on the 5th House)
    const talentsMap = {
      "Aries": "Pioneering new ideas, competitive debate, and rapid problem-solving. You are a quick learner who thrives under pressure.",
      "Taurus": "Artistic design, financial modeling, and an incredible, photographic memory. You learn slowly but retain information forever.",
      "Gemini": "Linguistics, coding, writing, and multitasking. You have a brilliant, fast-paced mind that absorbs data like a sponge.",
      "Cancer": "High emotional intelligence, historical research, and psychology. You have a highly intuitive intellect.",
      "Leo": "Creative arts, public speaking, and dramatic expression. You shine when presenting your ideas to a crowd.",
      "Virgo": "Data analysis, critical thinking, and coding. You have a razor-sharp, detail-oriented mind that catches what others miss.",
      "Libra": "Diplomacy, law, aesthetics, and strategic negotiations. You excel at seeing all sides of an intellectual argument.",
      "Scorpio": "Deep research, investigative sciences, and occult studies. You have a penetrating mind that loves solving complex mysteries.",
      "Sagittarius": "Philosophy, teaching, and exploring foreign cultures. You are a big-picture thinker driven by curiosity.",
      "Capricorn": "Engineering, history, and structural planning. You possess a highly disciplined and organized intellect.",
      "Aquarius": "Technology, astrology, social sciences, and radical innovation. You are a natural genius with an unconventional thought process.",
      "Pisces": "Poetry, music, spiritual philosophy, and abstract art. Your intellect operates on a highly imaginative and visionary frequency."
    };

    // 3. Higher Education & Future Academics (Based on the 9th House)
    const higherEdMap = {
      "Aries": "Your higher education journey will be self-directed and fast-paced. You may excel in intensive certifications over long, drawn-out degree programs.",
      "Taurus": "You are suited for prestigious, traditional universities. Degrees in finance, agriculture, or the arts will bring immense future fortune.",
      "Gemini": "You will likely pursue multiple degrees or dual majors. Your academic future points toward communications, IT, or literature.",
      "Cancer": "You may study close to home or pursue degrees related to caregiving, nursing, history, or real estate. Your academic success is tied to emotional comfort.",
      "Leo": "You are destined to stand out in university. Pursuing degrees in management, political science, or performing arts will lead to high honors.",
      "Virgo": "Your academic future is highly specialized. You will excel in rigorous programs like medicine, accounting, or computer science.",
      "Libra": "Your higher education will likely involve law, international relations, or design. University will also be a major networking and social hub for you.",
      "Scorpio": "You are meant for profound, intensive study. PhDs, research grants, psychology, or medical surgery are strong academic paths.",
      "Sagittarius": "You have the absolute best placement for higher education. Studying abroad, learning foreign languages, or pursuing philosophy/law is highly favored.",
      "Capricorn": "Your academic path will require immense discipline and hard work. Degrees in business, engineering, or public administration will yield massive long-term success.",
      "Aquarius": "You belong in cutting-edge research. Your academic future points toward emerging technologies, AI, sociology, or space sciences.",
      "Pisces": "Your higher education journey may be non-linear. You excel in environments that teach creativity, marine biology, psychology, or spiritual healing."
    };

    // 4. Learning Style (Based on Mercury's Sign)
    const mercury = chartData.planets.find(p => p.name === 'Mercury');
    let learningStyle = "Adaptable and intuitive.";
    
    if (mercury) {
      const fireSigns = ["Aries", "Leo", "Sagittarius"];
      const earthSigns = ["Taurus", "Virgo", "Capricorn"];
      const airSigns = ["Gemini", "Libra", "Aquarius"];
      const waterSigns = ["Cancer", "Scorpio", "Pisces"];

      if (fireSigns.includes(mercury.sign)) {
        learningStyle = "Visual & Action-Oriented. You learn best by doing, leading discussions, and seeing the big picture immediately.";
      } else if (earthSigns.includes(mercury.sign)) {
        learningStyle = "Practical & Tactile. You learn best through step-by-step logic, taking detailed notes, and hands-on application.";
      } else if (airSigns.includes(mercury.sign)) {
        learningStyle = "Conceptual & Auditory. You learn best by listening to lectures, debating ideas, and reading extensively.";
      } else if (waterSigns.includes(mercury.sign)) {
        learningStyle = "Emotional & Intuitive. You learn best when you feel a personal or emotional connection to the subject matter.";
      }
    }

    // 5. Check for Foreign Study / University Success Modifiers
    const planetsIn9th = chartData.planets.filter(p => p.sign === ninthHouseSign).map(p => p.name);
    let extraAcademicModifiers = [];
    if (planetsIn9th.includes("Rahu") || planetsIn9th.includes("Moon")) {
      extraAcademicModifiers.push("High probability of traveling abroad or relocating for your higher education.");
    }
    if (planetsIn9th.includes("Jupiter")) {
      extraAcademicModifiers.push("Exceptional academic luck. You will easily attract brilliant mentors and professors.");
    }
    if (planetsIn9th.includes("Sun")) {
      extraAcademicModifiers.push("Strong potential for academic leadership, scholarships, or gaining authority in your chosen field.");
    }

    return {
      fifthSign: fifthHouseSign,
      ninthSign: ninthHouseSign,
      hiddenTalents: talentsMap[fifthHouseSign],
      higherEd: higherEdMap[ninthHouseSign],
      learningStyle: learningStyle,
      modifiers: extraAcademicModifiers
    };
  };

  if (loading) {
    return (
      <div className="academics-page">
        <Navbar />
        <div className="premium-loader-container">
          <div className="wisdom-atom-loader">
            <div className="atom-center"></div>
            <div className="atom-ring ring-1"></div>
            <div className="atom-ring ring-2"></div>
            <div className="atom-ring ring-3"></div>
          </div>
          <h3 className="loader-title academics-title">Decoding Intellectual Blueprint...</h3>
          <p className="loader-subtitle">Mapping 5th and 9th House wisdom</p>
        </div>
      </div>
    );
  }

  return (
    <div className="academics-page">
      <Navbar />
      <div className="academics-container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        {error ? (
          <div className="error-banner">{error}</div>
        ) : (
          <div className="academics-content">
            <div className="academics-header">
              <h2>Intellect & Growth</h2>
              <p>Exploring your 5th and 9th Astrological Houses</p>
            </div>

            <div className="academics-grid">
              {/* Intellect & Talents Card */}
              <div className="astrology-card intellect-card">
                <div className="card-icon">🧠</div>
                <h3>Hidden Talents & Intellect</h3>
                <div className="house-badge">5th House: {academicProfile?.fifthSign}</div>
                <p className="prediction-text">
                  {academicProfile?.hiddenTalents}
                </p>
                
                <div className="learning-style-box">
                  <h4>Your Natural Learning Style (Mercury)</h4>
                  <p>{academicProfile?.learningStyle}</p>
                </div>
              </div>

              {/* Higher Education Card */}
              <div className="astrology-card education-card">
                <div className="card-icon">🎓</div>
                <h3>Future Academic Path</h3>
                <div className="house-badge">9th House: {academicProfile?.ninthSign}</div>
                <p className="prediction-text">
                  {academicProfile?.higherEd}
                </p>
                
                {academicProfile?.modifiers.length > 0 && (
                  <div className="modifiers-box">
                    <h4>Cosmic Academic Indicators:</h4>
                    <ul>
                      {academicProfile.modifiers.map((mod, idx) => (
                        <li key={idx}>{mod}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academics;
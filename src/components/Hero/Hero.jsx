import { useAuth } from '../../context/AuthContext';
import './Hero.css';

const Hero = () => {
  const { currentUser, openModal } = useAuth();

  const handleGenerateClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      openModal('signup');
    }
    // If logged in, it will naturally scroll to #generate via the a tag
  };

  return (
    <section className="hero" id="home">
      {/* ... keeping the stars and title the same ... */}
      <div className="stars"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Decode Your Destiny with <br />
          <span className="text-highlight">Ancient Vedic Wisdom</span>
        </h1>
        <p className="hero-subtitle">
          Get personalized astrological insights based on your exact birth chart.
        </p>
        <div className="hero-buttons">
          <a href="#generate" style={{textDecoration: 'none'}} onClick={handleGenerateClick}>
            <button className="btn-primary-glow">Generate Your Free Birth Chart</button>
          </a>
          <button className="btn-secondary" onClick={() => !currentUser ? openModal('login') : null}>
            Learn More
          </button>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="moving-zodiac">{"\u2650\uFE0E"}</div>
      </div>
    </section>
  );
};

export default Hero;
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section className="about-us" id="about">
      <div className="about-content">
        <h2>Bridging Ancient Wisdom with Modern Technology</h2>
        <p>
          We combine millennia-old Vedic wisdom with cutting-edge software to bring authentic astrological guidance to seekers worldwide. Our system strictly follows the principles of Parashara, Jaimini, and other classical texts to provide precise, mathematical predictions without the guesswork.
        </p>
        <div className="stats-container">
          <div className="stat-badge">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Trusted Users</span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">100%</span>
            <span className="stat-label">Mathematical Precision</span>
          </div>
        </div>
      </div>
      <div className="about-visual">
        <div className="yantra-placeholder">
          {/* A CSS representation of a sacred geometric pattern */}
          <div className="triangle up"></div>
          <div className="triangle down"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
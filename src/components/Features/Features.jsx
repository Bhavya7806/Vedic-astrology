import './Features.css';

const featuresData = [
  { icon: '☸️', title: 'Precise Vedic Calculations', desc: 'Based on ancient Parashari principles with accurate planetary positions.' },
  { icon: '🪐', title: 'Planetary Dashboard', desc: 'View all 9 Grahas with their houses, signs, and exact mathematical strengths.' },
  { icon: '⏳', title: 'Vimshottari Dasha', desc: 'Understand your current planetary periods and the precise timing of events.' },
  { icon: '💎', title: 'Personalized Remedies', desc: 'Get authentic Vedic remedies including specific mantras and gemstones.' },
  { icon: '✨', title: 'Special Yogas', desc: 'Discover Raj Yogas, Dhana Yogas, and other powerful astrological combinations.' },
  { icon: '🌙', title: '27 Nakshatras', desc: 'Deep dive into your birth star and its subtle psychological influences.' }
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="section-header">
        <h2>Unveil the Cosmos</h2>
        <p>Comprehensive astrological tools powered by rigorous mathematics and ancient texts.</p>
      </div>
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
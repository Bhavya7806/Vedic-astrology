import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">🕉️ JyotishVeda</div>
          <p>Illuminating life's path through the ancient science of Vedic Astrology.</p>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Services</h4>
          <ul>
            <li><a href="#">Birth Chart Generation</a></li>
            <li><a href="#">Horoscope Matching</a></li>
            <li><a href="#">Muhurta Calculation</a></li>
            <li><a href="#">Remedies</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Connected</h4>
          <p>Get cosmic updates delivered to your inbox.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 JyotishVeda. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2>Your Journey to Cosmic Clarity</h2>
      <div className="steps-container">
        <div className="step">
          <div className="step-number">1</div>
          <h3>Enter Details</h3>
          <p>Provide your exact date, time, and location of birth.</p>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-number">2</div>
          <h3>Calculate Chart</h3>
          <p>Our engine applies complex astronomy logic to build your map.</p>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-number">3</div>
          <h3>Get Predictions</h3>
          <p>Receive comprehensive, detailed analysis of your destiny.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
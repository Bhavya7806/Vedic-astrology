import './Testimonials.css';

const testimonialsData = [
  {
    quote: "The predictions matched exactly what my family guru told me! The Dasha analysis is incredibly precise and helped me plan my career moves.",
    author: "Rajesh K.",
    label: "Verified User"
  },
  {
    quote: "I was skeptical about automated astrology, but the way this platform mathematically calculates the Yogas and Nakshatras is phenomenal.",
    author: "Priya S.",
    label: "Astrology Student"
  },
  {
    quote: "A perfectly designed tool. The remedy suggestions were highly personalized and aligned beautifully with traditional Parashari principles.",
    author: "Amit V.",
    label: "Verified User"
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>Voices of the Cosmos</h2>
      <div className="testimonials-grid">
        {testimonialsData.map((test, index) => (
          <div className="testimonial-card" key={index}>
            <div className="quote-mark">"</div>
            <p className="testimonial-text">{test.quote}</p>
            <div className="testimonial-author">
              <h4>{test.author}</h4>
              <span>{test.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
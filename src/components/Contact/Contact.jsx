import './Contact.css';

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <h2>Connect With the Cosmos</h2>
        <p>Have questions about your chart or our platform? Reach out to us.</p>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit" className="btn-submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
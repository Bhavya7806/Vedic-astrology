import Navbar from '../Navbar/Navbar';
import Hero from '../Hero/Hero';
import ChartGenerator from '../ChartGenerator/ChartGenerator';
import Features from '../Features/Features';
import AboutUs from '../AboutUs/AboutUs';
import HowItWorks from '../HowItWorks/HowItWorks';
import Testimonials from '../Testimonials/Testimonials';
import Contact from '../Contact/Contact';
import Footer from '../Footer/Footer';
import AuthModal from '../AuthModal/AuthModal';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      
      {/* Interactive Data Collection Form */}
      <ChartGenerator />
      
      <AboutUs />
      
      {/* Wrapped in an ID so the Navbar "Services" link scrolls perfectly here */}
      <div id="services">
        <Features />
        <HowItWorks />
      </div>

      <Testimonials />
      <Contact />
      <Footer />

      {/* The Global Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export default LandingPage;
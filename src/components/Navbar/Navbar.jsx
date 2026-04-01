import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, openModal, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#home" className="navbar-logo">
          <span className="logo-icon">🕉️</span>
          <span className="logo-text">JyotishVeda</span>
        </a>
        
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Dynamic Auth Buttons */}
        <div className="navbar-actions">
          {currentUser ? (
            <button className="btn-login" onClick={logout}>Logout</button>
          ) : (
            <>
              <button className="btn-login" onClick={() => openModal('login')}>Login</button>
              <button className="btn-signup" onClick={() => openModal('signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
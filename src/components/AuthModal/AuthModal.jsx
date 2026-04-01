import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = () => {
  const { isModalOpen, closeModal, modalMode, login, signup, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLogin(modalMode === 'login');
    setError(''); // Clear errors when switching modes
  }, [modalMode, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      closeModal(); // Close on success
    } catch (err) {
      // Clean up Firebase error messages for the user
      setError(err.message.replace('Firebase: ', '')); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await loginWithGoogle();
      closeModal();
    } catch (err) {
      setError('Failed to sign in with Google.');
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-altar" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>×</button>
        
        <div className="modal-header">
          <span className="modal-icon">✨</span>
          <h2>{isLogin ? 'Enter the Sanctuary' : 'Begin Your Journey'}</h2>
          <p>{isLogin ? 'Welcome back, seeker.' : 'Create an account to save your cosmic data.'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="input-group">
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn-auth-primary" disabled={isLoading}>
            {isLoading ? 'Channeling...' : (isLogin ? 'Illuminate Path (Login)' : 'Awaken (Sign Up)')}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <button className="btn-google" onClick={handleGoogleSignIn} disabled={isLoading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        <div className="modal-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already walking the path? "}
            <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
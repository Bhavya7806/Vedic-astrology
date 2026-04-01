import { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents UI flashing while Firebase checks session
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');

  const openModal = (mode = 'login') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Real Firebase Functions
  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Add the user's display name to their Firebase profile
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    return signOut(auth);
  };

  // Listen for active sessions when the app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isModalOpen,
    modalMode,
    openModal,
    closeModal,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
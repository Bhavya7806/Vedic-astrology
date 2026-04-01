import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Ensure this path matches where your firebase.js is
import KundliDashboard from '../KundliDashboard/KundliDashboard';
import './ChartGenerator.css';

const ChartGenerator = () => {
  const { currentUser, openModal } = useAuth();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    locationDisplay: '', 
    lat: null,           
    lon: null            
  });
  
  // Location Autocomplete State
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // UI / Loading State
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationStep, setCalculationStep] = useState('');
  const [error, setError] = useState('');
  
  // Final Data State
  const [generatedChart, setGeneratedChart] = useState(null);
  const [trustFacts, setTrustFacts] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const query = e.target.value;
    setFormData(prev => ({ ...prev, locationDisplay: query, lat: null, lon: null }));
    
    if (query.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSearchingLocation(true);
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    
    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&format=json&apiKey=${apiKey}`)
      .then(response => response.json())
      .then(result => {
        if (result.results) {
          setSuggestions(result.results);
          setShowDropdown(true);
        }
      })
      .catch(err => console.error('Geoapify error:', err))
      .finally(() => setIsSearchingLocation(false));
  };

  const handleSelectLocation = (location) => {
    const formattedName = `${location.city || location.name}, ${location.state ? location.state + ', ' : ''}${location.country}`;
    setFormData(prev => ({ ...prev, locationDisplay: formattedName, lat: location.lat, lon: location.lon }));
    setShowDropdown(false);
  };

  const handleGenerateChart = async (e) => {
    e.preventDefault();
    setError('');
    
    // 1. Security & Validation Checks
    if (!currentUser) {
      openModal('login');
      return;
    }

    if (!formData.lat || !formData.lon) {
      setError("Please select a precise location from the dropdown suggestions.");
      return;
    }

    setIsCalculating(true);
    setCalculationStep('Aligning astronomical coordinates...');

    try {
      // 2. Fetch data from your Express Backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chart/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          date: formData.date,
          time: formData.time,
          lat: formData.lat,
          lon: formData.lon
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to calculate chart");
      }

      setCalculationStep('Analyzing cosmic timeline...');
      
      // 3. Save the results to Firebase Firestore
      try {
        const userChartRef = doc(db, "users", currentUser.uid, "savedCharts", "primaryChart");
        await setDoc(userChartRef, {
          seekerName: formData.name,
          birthDetails: {
            date: formData.date,
            time: formData.time,
            location: formData.locationDisplay,
            lat: formData.lat,
            lon: formData.lon
          },
          astrologyData: result.data.astrology,
          trustFacts: result.data.trustFacts,
          updatedAt: new Date().toISOString()
        });
        console.log("Chart successfully saved to Firebase!");
      } catch (dbError) {
        console.error("Failed to save to Firebase:", dbError);
        // We log the error but do not throw it, so the user still sees their chart even if saving fails.
      }

      // 4. Reveal the Dashboard
      // A slight aesthetic delay makes the math feel more powerful
      setTimeout(() => {
        setGeneratedChart(result.data.astrology);
        setTrustFacts(result.data.trustFacts);
        setIsCalculating(false);
      }, 1200);

    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsCalculating(false);
    }
  };

  // If calculation is complete, swap the form out for the Dashboard
  if (generatedChart && trustFacts) {
    return (
      <section id="generate">
        <KundliDashboard chartData={generatedChart} trustFacts={trustFacts} />
      </section>
    );
  }

  return (
    <section className="chart-generator-section" id="generate">
      <div className="generator-container">
        <div className="generator-header">
          <h2>Cast Your Natal Chart</h2>
          <p>Provide your exact birth details to calculate your cosmic blueprint.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {isCalculating ? (
          <div className="calculation-loader">
             <div className="loader-wheel">{"\u2638\uFE0E"}</div>
             <h3 className="pulse-text">{calculationStep}</h3>
             <div className="progress-bar"><div className="progress-fill"></div></div>
          </div>
        ) : (
          <form className="generator-form" onSubmit={handleGenerateChart}>
            <div className="form-row">
              <div className="input-wrapper">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row split">
              <div className="input-wrapper">
                <label htmlFor="date">Date of Birth</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="input-wrapper">
                <label htmlFor="time">Exact Time</label>
                <input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-wrapper autocomplete-wrapper">
                <label htmlFor="location">Exact Place of Birth (Village / City)</label>
                <input 
                  type="text" 
                  id="location" 
                  autoComplete="off"
                  placeholder="e.g., Borsad, Gujarat, India"
                  value={formData.locationDisplay}
                  onChange={handleLocationChange}
                  required 
                />
                
                {isSearchingLocation && <small className="hint-text" style={{color: "var(--color-saffron)"}}>Searching cosmos...</small>}
                {!isSearchingLocation && <small className="hint-text">Select from the dropdown to ensure mathematical precision.</small>}

                {showDropdown && suggestions.length > 0 && (
                  <ul className="suggestions-dropdown">
                    {suggestions.map((item, index) => (
                      <li key={index} onClick={() => handleSelectLocation(item)}>
                        <span className="city-name">{item.city || item.name}</span>
                        <span className="state-name">
                          {item.state ? `${item.state}, ` : ''}{item.country}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button type="submit" className="btn-generate">
              {currentUser ? 'Calculate Planetary Positions' : 'Login to Calculate Chart'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ChartGenerator;
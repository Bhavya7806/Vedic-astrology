const swisseph = require('swisseph');
const moment = require('moment');

// Define the planets we want to calculate (Swiss Ephemeris constants)
const PLANETS = {
  Sun: swisseph.SE_SUN,
  Moon: swisseph.SE_MOON,
  Mars: swisseph.SE_MARS,
  Mercury: swisseph.SE_MERCURY,
  Jupiter: swisseph.SE_JUPITER,
  Venus: swisseph.SE_VENUS,
  Saturn: swisseph.SE_SATURN,
  Rahu: swisseph.SE_TRUE_NODE, // True North Node
};

const calculatePlanetaryPositions = (dateStr, timeStr, lat, lon) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`\n--- STARTING COSMIC CALCULATION ---`);
      console.log(`Received Data -> Date: ${dateStr}, Time: ${timeStr}, Lat: ${lat}, Lon: ${lon}`);

      // 1. Convert local time to UTC
      const localDateTime = moment(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm');
      const utcDateTime = localDateTime.utc();
      
      const year = utcDateTime.year();
      const month = utcDateTime.month() + 1;
      const day = utcDateTime.date();
      const hour = utcDateTime.hours() + (utcDateTime.minutes() / 60.0);

      // 2. Calculate Julian Day
      const julianDay = swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
      console.log(`Calculated Julian Day: ${julianDay}`);

      // 3. Set Sidereal Mode to Lahiri
      swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

      const chartData = {
        lagna: null,
        planets: []
      };

      // 4. Calculate Ascendant (Lagna)
      // 'W' stands for Whole Sign houses, which is much safer and standard for Vedic Astrology
      const houses = swisseph.swe_houses(julianDay, lat, lon, 'W');
      
      // STRICT ERROR CHECKING: If the library throws an internal error, catch it!
      if (houses.error) {
        console.error("SWISS EPHEMERIS INTERNAL ERROR:", houses.error);
        throw new Error(`Ephemeris Engine Error: ${houses.error}`);
      }

      console.log("House Calculation Success. Ascendant data found.");

      // Safely extract the Ascendant, handling different wrapper versions
      let ascendantDegree = 0;
      if (houses.asmc && houses.asmc.length > 0) {
        ascendantDegree = houses.asmc[0];
      } else if (houses.ascendant) {
        ascendantDegree = houses.ascendant;
      }
      
      chartData.lagna = {
        sign: getZodiacSign(ascendantDegree),
        degree: ascendantDegree % 30,
        absoluteDegree: ascendantDegree
      };

      // 5. Calculate Planet Positions
      for (const [name, sePlanetId] of Object.entries(PLANETS)) {
        const flag = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED; 
        const result = swisseph.swe_calc_ut(julianDay, sePlanetId, flag);
        
        if (result.error) {
          console.warn(`Warning calculating ${name}: ${result.error}`);
          continue; // Skip this planet if it fails, but don't crash the whole app
        }

        const absoluteDegree = result.longitude;
        
        chartData.planets.push({
          name: name,
          sign: getZodiacSign(absoluteDegree),
          degree: absoluteDegree % 30,
          absoluteDegree: absoluteDegree,
          isRetrograde: result.longitudeSpeed < 0
        });
      }

      // Add Ketu
      const rahu = chartData.planets.find(p => p.name === 'Rahu');
      if (rahu) {
        const ketuDegree = (rahu.absoluteDegree + 180) % 360;
        chartData.planets.push({
          name: 'Ketu',
          sign: getZodiacSign(ketuDegree),
          degree: ketuDegree % 30,
          absoluteDegree: ketuDegree,
          isRetrograde: true 
        });
      }

      console.log(`--- CALCULATION COMPLETE --- \n`);
      resolve(chartData);
    } catch (error) {
      console.error("CRITICAL ENGINE FAILURE:", error);
      reject(error);
    }
  });
};

// Helper function to map a 360-degree circle to the 12 Zodiac signs
const getZodiacSign = (degree) => {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const signIndex = Math.floor(degree / 30);
  return signs[signIndex];
};

module.exports = {
  calculatePlanetaryPositions
};
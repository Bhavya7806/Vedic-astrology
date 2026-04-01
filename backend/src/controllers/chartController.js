const astrologyEngine = require('../services/astrologyEngine');
const trustEngine = require('../services/trustEngine');

const generateChart = async (req, res) => {
  try {
    const { name, date, time, lat, lon } = req.body;

    if (!date || !time || !lat || !lon) {
      return res.status(400).json({ success: false, message: 'Missing parameters.' });
    }

    // 1. Calculate the raw math
    const chartData = await astrologyEngine.calculatePlanetaryPositions(date, time, parseFloat(lat), parseFloat(lon));

    // 2. Generate the "Proof of Authenticity" facts using AI
    const pastFacts = await trustEngine.generatePastFacts(chartData);

    // 3. Send everything to the frontend
    res.status(200).json({
      success: true,
      data: {
        seekerName: name,
        astrology: chartData,
        trustFacts: pastFacts
      }
    });

  } catch (error) {
    console.error("Chart Generation Error:", error);
    res.status(500).json({ success: false, message: 'Failed to calculate chart.' });
  }
};

module.exports = { generateChart };
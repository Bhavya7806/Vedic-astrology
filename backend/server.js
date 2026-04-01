require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chartRoutes = require('./src/routes/chartRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://vedic-astrology.vercel.app'], // Replace with your exact Vercel URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/v1/chart', chartRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'active', message: 'JyotishVeda API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✨ Cosmic Engine running on port ${PORT}`);
});
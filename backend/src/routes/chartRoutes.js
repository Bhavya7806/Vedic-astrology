const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');

// POST request to calculate the chart
router.post('/calculate', chartController.generateChart);

module.exports = router;
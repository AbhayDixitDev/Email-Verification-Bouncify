const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/api/ApiController.js');

// Routes for testing
router.get('/sample', ApiController.sample);

module.exports = router;
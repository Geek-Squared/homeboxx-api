const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/search', locationController.searchLocation);

module.exports = router;
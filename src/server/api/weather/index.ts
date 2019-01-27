
import weather from './weather-route.controller';
const router = require('express').Router();

module.exports = router;


// get the 7-day forecast for a given location (latitude/longitude)
// api/weather
router.get('/', weather.getWeather);

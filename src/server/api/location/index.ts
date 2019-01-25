
import location from './location-route.controller';
const router = require('express').Router();

module.exports = router;


//get a location (latitude/longitude) from city name
//api/location
router.get('/', location.getLocation);
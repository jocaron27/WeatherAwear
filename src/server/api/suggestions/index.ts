
import suggestions from './suggestions-route.controller';
const router = require('express').Router();

module.exports = router;

//get all weather-clothing suggestions
//api/suggestions
router.get('/', suggestions.getAllSuggestions);

//get all weather-clothing suggestions given weather category
//api/suggestions/weather/:id
router.get('/weather/:id', suggestions.getWeatherSuggestions);
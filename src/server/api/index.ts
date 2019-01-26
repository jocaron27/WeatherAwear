const router = require('express').Router();
module.exports = router;

// user info
// router.use('/users', require('./users'));

// clothing items
// router.use('/apparel', require('./apparel'));

// geolocation
router.use('/location', require('./location'));

// weather-clothing pairings
// router.use('/suggestions', require('./suggestions'));

// weather forecast
router.use('/weather', require('./weather'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  next(error);
});
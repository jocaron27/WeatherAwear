
import user from './user-route.controller';
const router = require('express').Router();

module.exports = router;

//get logged in user
//api/users
router.get('/', user.getUser);

//update a user's default location
//api/users/location
router.put('/location', user.updateUserLocation);
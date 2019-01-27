import auth from './auth-route.controller';
const router = require('express').Router();

module.exports = router;

// authenticate user attempting login
// auth/login
router.post('/login', auth.authenticateUser);

// create new user
// auth/signup
router.post('/signup', auth.createUser);

// log out user
// auth/logout
router.post('/logout', auth.logout);

// get user info
// auth/me
router.get('/me', auth.getUserInfo);

// auth/google
router.use('/google', require('./google'));

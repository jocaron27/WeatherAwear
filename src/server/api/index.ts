const router = require('express').Router();
module.exports = router;
import * as Express from 'express';
import { IGetUserAuthInfoRequest } from './users/user-route.controller';

// API access control middleware
router.use((req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction) => {
    if (!req.user) res.sendStatus(403);
    else next();
});

// user info
router.use('/users', require('./users'));

// clothing items
router.use('/apparel', require('./apparel'));

// geolocation
router.use('/location', require('./location'));

// weather-clothing pairings
router.use('/suggestions', require('./suggestions'));

// weather forecast
router.use('/weather', require('./weather'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  next(error);
});
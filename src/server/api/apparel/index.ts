
import apparel from './apparel-route.controller';
const router = require('express').Router();

module.exports = router;

//get all clothing items
//api/apparel
router.get('/', apparel.getItems);
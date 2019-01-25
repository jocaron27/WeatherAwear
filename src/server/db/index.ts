const Sequelize = require('sequelize');
if (process.env.NODE_ENV !== 'production') require('../../../secrets');
const dbInstance = new Sequelize(
  process.env.DATABASE_URL || `postgres://${process.env.PG_USER}:${process.env.PG_PW}@localhost:5432/weatherawear`, {
    logging: false
  }
);

// register models
// require('./models');

module.exports = dbInstance;
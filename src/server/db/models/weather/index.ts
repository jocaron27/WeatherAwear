namespace database {
  const Sequelize = require('sequelize');
  const db = require('../../db');

  const Weather = db.define('weather', {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('Precipitation', 'Cloud Cover', 'Temperature'),
      allowNull: false
    }
  });

  module.exports = Weather;
}

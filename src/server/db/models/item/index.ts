namespace database {
  const Sequelize = require('sequelize');
  const db = require('../../db');

  const Item = db.define('item', {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING,
      defaultValue: 'none'
    },
    icon: {
      type: Sequelize.STRING
    }
  });

  module.exports = Item;
}

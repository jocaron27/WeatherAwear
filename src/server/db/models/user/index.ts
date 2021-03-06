namespace database {
  const crypto = require('crypto');
  const Sequelize = require('sequelize');
  const db = require('../../db');

  const User = db.define('user', {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    },
    googleId: {
      type: Sequelize.STRING
    },
    longitude: {
      type: Sequelize.FLOAT,
      defaultValue: -74.0060
    },
    latitude: {
      type: Sequelize.FLOAT,
      defaultValue: 40.7128
    },
    location: {
      type: Sequelize.STRING,
      defaultValue: 'New York, NY, USA'
    }
  });

  module.exports = User;

  /**
   * instanceMethods
   */
  User.prototype.correctPassword = function (candidatePwd) {
    return User.encryptPassword(candidatePwd, this.salt) === this.password;
  }

  /**
   * classMethods
   */
  User.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
  }

  User.encryptPassword = function (plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex')
  }

  /**
   * hooks
   */
  const setSaltAndPassword = user => {
    if (user.changed('password')) {
      user.salt = User.generateSalt();
      user.password = User.encryptPassword(user.password, user.salt);
    }
  }

  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);
}
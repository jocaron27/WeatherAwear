const User = require('./user');
const Item = require('./item');
const Weather = require('./weather');
const Suggestion = require('./suggestion');

// Associations
/** Many-to-many relationship between weather categories and articles of clothing,
 *  resulting in a weather-clothing suggestion 
 * */
Item.belongsToMany(Weather, { through: 'suggestion' });
Weather.belongsToMany(Item, { through: 'suggestion' });


module.exports = {
  User, Item, Weather, Suggestion
};

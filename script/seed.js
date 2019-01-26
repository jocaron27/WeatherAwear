const db = require('../src/server/db');
const Item = require('../src/server/db/models/item');
const Weather = require('../src/server/db/models/weather');
const Suggestion = require('../src/server/db/models/suggestion');

const items = [{
    id: 1,
    name: 'umbrella',
    type: 'accessory',
    icon: '/umbrella.png'
}, {
    id: 2,
    name: 'rainboots',
    type: 'shoes',
    icon: '/rainboots.png'
}, {
    id: 3,
    name: 'raincoat',
    type: 'jacket',
    icon: '/raincoat.png'
}, {
    id: 4,
    name: 'sunglasses',
    type: 'accessory',
    icon: '/sunglasses.png'
}, {
    id: 5,
    name: 'thick coat',
    type: 'jacket',
    icon: '/thickjacket.png'
}, {
    id: 6,
    name: 'medium coat',
    type: 'jacket',
    icon: '/mediumjacket.png'
}, {
    id: 7,
    name: 'light coat',
    type: 'jacket',
    icon: '/lightjacket.png'
}, {
    id: 8,
    name: 'sweater',
    type: 'top',
    icon: '/sweater.png'
}, {
    id: 9,
    name: 'long pants',
    type: 'bottom',
    icon: '/longpants.png'
}, {
    id: 10,
    name: 'shorts',
    type: 'bottom',
    icon: '/shorts.png'
}, {
    id: 11,
    name: 'skirt',
    type: 'bottom',
    gender: 'female',
    icon: '/skirt.png'
}, {
    id: 12,
    name: 'gloves',
    type: 'accessory',
    icon: '/gloves.png'
}, {
    id: 13,
    name: 'hat',
    type: 'accessory',
    icon: '/hat.png'
}, {
    id: 14,
    name: 't-shirt',
    type: 'top',
    icon: '/tshirt.png'
}, {
    id: 15,
    name: 'sleeveless shirt',
    type: 'top',
    icon: '/sleeveless.png'
}, {
    id: 16,
    name: 'sandals',
    type: 'shoes',
    icon: '/sandals.png'
}, {
    id: 17,
    name: 'dress',
    type: 'top',
    gender: 'female',
    icon: '/dress.png'
}, {
    id: 18,
    name: 'scarf',
    type: 'accessory',
    icon: '/scarf.png'
},
{
    id: 19,
    name: 'snow boots',
    type: 'shoes',
    icon: '/rainboots.png'
}];


const weathers = [{
    id: 1,
    name: 'rain',
    type: 'Precipitation'
}, {
    id: 2,
    name: 'snow',
    type: 'Precipitation',
}, {
    id: 3,
    name: 'sun',
    type: 'Cloud Cover',
}, {
    id: 4,
    name: 'coldest',
    type: 'Temperature',
}, {
    id: 5,
    name: 'very cold',
    type: 'Temperature',
}, {
    id: 6,
    name: 'colder',
    type: 'Temperature',
}, {
    id: 7,
    name: 'average',
    type: 'Temperature',
}, {
    id: 8,
    name: 'warm',
    type: 'Temperature',
}, {
    id: 9,
    name: 'warmer',
    type: 'Temperature',
}, {
    id: 10,
    name: 'very warm',
    type: 'Temperature',
}, {
    id: 11,
    name: 'warmest',
    type: 'Temperature',
}]

const suggestions = [{
    weatherId: 1,
    itemId: 1
}, {
    weatherId: 1,
    itemId: 2
}, {
    weatherId: 1,
    itemId: 3
}, {
    weatherId: 2,
    itemId: 19
}, {
    weatherId: 3,
    itemId: 4
}, {
    weatherId: 4,
    itemId: 5
}, {
    weatherId: 4,
    itemId: 9
}, {
    weatherId: 4,
    itemId: 12
}, {
    weatherId: 4,
    itemId: 13
}, {
    weatherId: 4,
    itemId: 18
}, {
    weatherId: 5,
    itemId: 5
}, {
    weatherId: 5,
    itemId: 9
}, {
    weatherId: 5,
    itemId: 18
}, {
    weatherId: 6,
    itemId: 6
}, {
    weatherId: 6,
    itemId: 8
}, {
    weatherId: 6,
    itemId: 9
}, {
    weatherId: 6,
    itemId: 18
}, {
    weatherId: 7,
    itemId: 6
}, {
    weatherId: 7,
    itemId: 9
}, {
    weatherId: 8,
    itemId: 7
}, {
    weatherId: 8,
    itemId: 9
}, {
    weatherId: 9,
    itemId: 10
}, {
    weatherId: 9,
    itemId: 11
}, {
    weatherId: 9,
    itemId: 14
}, {
    weatherId: 10,
    itemId: 10
}, {
    weatherId: 10,
    itemId: 11
}, {
    weatherId: 10,
    itemId: 15
}, {
    weatherId: 10,
    itemId: 17
}, {
    weatherId: 11,
    itemId: 10
}, {
    weatherId: 11,
    itemId: 11
}, {
    weatherId: 11,
    itemId: 15
}, {
    weatherId: 11,
    itemId: 16
}, {
    weatherId: 11,
    itemId: 17
}]

const seed = () =>
Promise.all(items.map(item =>
    Item.create(item))
)
    .then(() =>
    Promise.all(weathers.map(weather =>
        Weather.create(weather))
    ))
    .then(() =>
    Promise.all(suggestions.map(suggestion => Suggestion.create(suggestion)))
    )

const main = () => {
console.log('Syncing db...');
db.sync({ force: true })
    .then(() => {
    console.log('Seeding databse...');
    return seed();
    })
    .catch(err => {
    console.log('Error while seeding');
    console.log(err.stack);
    })
    .then(() => {
    db.close();
    return null;
    });
};

main();

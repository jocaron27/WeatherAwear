
'use strict';

//#region ------------------------- Imports --------------------------

import { google, createClient, GoogleMapsClient } from '@google/maps';
import { request } from 'https';
const { Item, Suggestion, User } = require('../db/models')
const axios = require('axios');

//#endregion

//#region -------------------------- Types ----------------------------

/** Callback defined in the route controller
 * Logic to be performed on returned data and/or error
 */
export type AdapterCallback = (data: any, error?: any) => void;

/** Request parameters for API */
export type RequestInfo = {
    [propNames: string]: any;
}

//#endregion

/**
 * Initial data request layer for all APIs
 */
class ApiAdapter {

    constructor() {
        // empty constructor
    }

    /** Authenticate user email and password */
    public authenticateUser(requestInfo: RequestInfo, cb: AdapterCallback): void {
        console.debug('Call starting: apiAdapter authenticateUser');

        const { email, password } = requestInfo;

        // sequelize findOne method returns user for given email
        User.findOne({where: { email }})
            .then(user => {
                if (!user) {
                    console.debug('APIAdapter@authenticateUser - Call ended with error');
                    cb(null, 'User not found');
                } else if (!user.correctPassword(password)) {
                    console.debug('APIAdapter@authenticateUser - Call ended with error');
                    cb(null, 'Incorrect password');
                } else {
                    console.debug('APIAdapter@authenticateUser - Call ended');
                    cb(user);
                }
            })
            .catch(error => {
                console.debug('APIAdapter@authenticateUser - Call ended with error');
                cb(null, error);
            })
    }

    /** Add new user to database and log in */
    public createUser(requestInfo: RequestInfo, cb: AdapterCallback): void {
        console.debug('Call starting: apiAdapter createUser');
        console.log(requestInfo);
        // sequelize create method adds new user row to table
        User.create(requestInfo)
            .then(user => {
                console.debug('APIAdapter@createUser - Call ended');
                cb(user);
            })
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    console.debug('APIAdapter@createUser - Call ended with error', err);
                    cb(null, 'User already exists')
                } else if (err.name === 'SequelizeValidationError'){
                    console.debug('APIAdapter@createUser - Call ended with error', err);
                    cb(null, 'Please enter a valid email address.')
                } else {
                    console.debug('APIAdapter@createUser - Call ended with error');
                    cb(null, err);
                }
            })
    }

    /** Gets all weather-clothing suggestions from postgres/sequelize database */
    public getAllSuggestions(cb: AdapterCallback): void {
        console.debug('Call starting: apiAdapter getAllSuggestions');

        // sequelize findAll method returns all rows from Suggestion table
        Suggestion.findAll()
            .then(suggestions => {
                console.debug('APIAdapter@getAllSuggestions - Call ended');
                cb(suggestions);
            })
            .catch(error => {
                console.debug('APIAdapter@getAllSuggestions - Call ended with error');
                cb(null, error);
            });
    }

    /** Gets all clothing items from postgres/sequelize database */
    public getItems(cb: AdapterCallback): void {
        console.debug('Call starting: apiAdapter getItems');

        // sequelize findAll method returns all rows from Item table
        Item.findAll()
            .then(items => {
                console.debug('APIAdapter@getItems - Call ended');
                cb(items);
            })
            .catch(err => {
                console.debug('APIAdapter@getItems - Call ended with error');
                cb(null, err);
            });
    }

    /** Requests & formats location data from Google Geocoding API */
    public getLocation(requestInfo: google.maps.GeocoderRequest, cb: AdapterCallback): void {
        console.debug('Call Starting: apiAdapter getLocation');

        const geoCoder: GoogleMapsClient = createClient({
            key: process.env.GOOGLE_GEOLOCATION_KEY
        })
        
        geoCoder.geocode(requestInfo, (error, response) => {
            const locationResponse = formatLocationResponse(response.json.results);

            // log if any values are not defined
            if (locationResponse.lat === undefined 
                || locationResponse.lng === undefined 
                || !locationResponse.location) {
                console.debug('Invalid data format for API Adapter@getLocation', locationResponse);
            }
            if (error) {
                console.debug('Error: API Adapter@getLocation');
                console.debug(error);
            }

            console.debug('APIAdapter@getLocation - Call ended');
            cb(locationResponse, error);
        })

        /** Extract relevant data for location response 
         * Latitude and longitude are required inputs for DarkSky weather API
         * Formatted address is used in the UI to display the official location
        */
        // TODO: type arg as google.maps.GeocoderResult[] when @types/googlemaps is updated
        let formatLocationResponse = (response): appTypes.LocationResponse => {
            console.debug('Formatting location response');
            // use first result in response array
            const result = response && response[0] && response[0];
            
            // latitude
            const lat: number = result && result.geometry.location.lat;
            // longitude
            const lng: number = result && result.geometry.location.lng;
            // location
            const location: string = result.formatted_address;
            // response
            const locationResponse: appTypes.LocationResponse = { lat, lng, location };

            return locationResponse;
        }
    }

    /** Gets logged in user from postgres/sequelize database */
    public getUser(requestInfo: RequestInfo, cb: AdapterCallback): void {
        console.debug('Call Starting: apiAdapter getUser');

        if (requestInfo.user) {
            const { id } = requestInfo.user;
            
            // sequelize findOne method returns user rows from User table matching ID of logged in user
            User.findOne({
              where: {
                id
              },
              attributes: ['id', 'email', 'longitude', 'latitude', 'location']
            })
              .then(user => {
                  console.debug('APIAdapter@getUser - Call ended');
                  cb(user);
              })
              .catch(error => {
                  console.debug('APIAdapter@getUser - Call ended with error');
                  cb(null, error);
              })
        } else {
            console.debug('APIAdapter@getUser - Call ended with error');
            cb(null, 'No user provided - apiAdapter@getUser');
        }
    }

    /** Requests and formats weather forecast data from DarkSky Weather API */
    public getWeather(requestInfo: RequestInfo, cb: AdapterCallback): void {
        console.debug('Call Starting: apiAdapter getWeather');

        const { latitude, longitude } = requestInfo;

        // call DarkSky API
        const result = axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${latitude},${longitude}`)
            .then(response => {
                const weatherResponse = formatWeatherResponse(response);

                console.debug('APIAdapter@getWeather - Call ended')
                cb(weatherResponse);
            })
            .catch(error => {
                console.debug('APIAdapter@getWeather - Call ended with error')
                cb(null, error);
            })

        /** Extract relevant data for daily weather forecast
         * See additional available properties at https://darksky.net/dev/docs#response-format
         */
        let formatWeatherResponse = (response): appTypes.WeatherResponse => {
            console.debug('Formatting location response');

            const forecast = response.data.daily.data;

            return forecast.map(day => {
                return {
                    time: day.time,
                    timezone: response.data.timezone,
                    summary: day.summary,
                    icon: day.icon,
                    precip: day.precipProbability,
                    precipType: day.precipType,
                    cloud: day.cloudCover,
                    hi: day.temperatureHigh,
                    lo: day.temperatureLow
                }
            })
        }

        return result;
    }

     /** Gets all weather-clothing suggestions from postgres/sequelize database, given weather category */
     public getWeatherSuggestions(requestInfo: RequestInfo, cb: AdapterCallback): void {
        console.debug('Call starting: apiAdapter getWeatherSuggestions');

        const { weatherId } = requestInfo;

        Suggestion.findAll({
            where: {
                weatherId
            }
        })
            .then(suggestions => {
                console.debug('APIAdapter@getWeatherSuggestions - Call ended');
                cb(suggestions)
            })
            .catch(error => {
                console.debug('APIAdapter@getWeatherSuggestions - Call ended with error');
                cb(null, error);
            })
    }

    /** Updates default location for logged in user */
    public updateUserLocation(requestInfo: RequestInfo, cb: AdapterCallback): void {
        console.debug('Call Starting: apiAdapter updateUserLocation');

        if (requestInfo.user) {
            const { id } = requestInfo.user;
            const { latitude, longitude, location } = requestInfo;

            // sequelize findById method returns user for given ID
            User.findById(id)
                .then(user => user.update({ latitude, longitude, location }))
                .then(user => {
                cb(user);
                })
                .catch(error => {
                console.debug('APIAdapter@updateUserLocation - Call ended with error');
                cb(null, error);
                });
        } else {
            console.debug('APIAdapter@updateUserLocation - Call ended with error');
            cb(null, 'No user provided - apiAdapter@updateUserLocation');
        }
    }
}

/** Instantiates & returns the API Adapter class with dependencies */
export function createAPIAdapter(): ApiAdapter {
    let apiAdapter = new ApiAdapter();

    return apiAdapter;
}
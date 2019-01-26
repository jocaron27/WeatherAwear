
'use strict';

//#region ------------------------- Imports --------------------------

import { google, createClient, GoogleMapsClient } from '@google/maps';
import { Logger } from '../logger';
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

    constructor(private logger: Logger) {
        // empty constructor
    }

    /** Authenticate user email and password */
    public authenticateUser(requestInfo: RequestInfo, cb: AdapterCallback): void {
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call starting: APIAdapter@authenticateUser`);

        const { email, password } = requestInfo;

        // sequelize findOne method returns user for given email
        User.findOne({where: { email }})
            .then(user => {
                if (!user) {
                    const endTime = new Date(Date.now());
                    this.logger.error(`${endTime} - Call ended with error: APIAdapter@authenticateUser`);
                    cb(null, 'User not found');
                } else if (!user.correctPassword(password)) {
                    const endTime = new Date(Date.now());
                    this.logger.error(`${endTime} - Call ended with error: APIAdapter@authenticateUser`);
                    cb(null, 'Incorrect password');
                } else {
                    const endTime = new Date(Date.now());
                    this.logger.debug(`${endTime} - Call ended: APIAdapter@authenticateUser`);
                    cb(user);
                }
            })
            .catch(error => {
                const endTime = new Date(Date.now());
                this.logger.error(`${endTime} - Call ended with error: APIAdapter@authenticateUser`);
                cb(null, error);
            })
    }

    /** Add new user to database and log in */
    public createUser(requestInfo: RequestInfo, cb: AdapterCallback): void {
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call starting: APIAdapter@createUser`);
        this.logger.debug(requestInfo);

        // sequelize create method adds new user row to table
        User.create(requestInfo)
            .then(user => {
                const endTime = new Date(Date.now());
                this.logger.debug(`${endTime} - Call ended: APIAdapter@createUser`);
                cb(user);
            })
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const endTime = new Date(Date.now());
                    this.logger.error(`${endTime} - Call ended with error: APIAdapter@createUser`, err);
                    cb(null, 'User already exists')
                } else if (err.name === 'SequelizeValidationError'){
                    const endTime = new Date(Date.now());
                    this.logger.error(`${endTime} - Call ended with error: APIAdapter@createUser`, err);
                    cb(null, 'Please enter a valid email address.')
                } else {
                    const endTime = new Date(Date.now());
                    this.logger.error(`${endTime} - Call ended with error: APIAdapter@createUser`);
                    cb(null, err);
                }
            })
    }

    /** Gets all weather-clothing suggestions from postgres/sequelize database */
    public getAllSuggestions(cb: AdapterCallback): void {
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call starting: APIAdapter@getAllSugestions`);

        // sequelize findAll method returns all rows from Suggestion table
        Suggestion.findAll()
            .then(suggestions => {
                const endTime = new Date(Date.now());
                this.logger.debug(`${endTime} - Call ended: APIAdapter@getAllSuggestions`);
                cb(suggestions);
            })
            .catch(error => {
                const endTime = new Date(Date.now());
                this.logger.error(`${endTime} - Call ended with error: APIAdapter@getAllSuggestions`);
                cb(null, error);
            });
    }

    /** Gets all clothing items from postgres/sequelize database */
    public getItems(cb: AdapterCallback): void {
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call starting: APIAdapter@getItems`);

        // sequelize findAll method returns all rows from Item table
        Item.findAll()
            .then(items => {
                const endTime = new Date(Date.now());
                this.logger.debug(`${endTime} - Call ended: APIAdapter@getItems`);
                cb(items);
            })
            .catch(err => {
                const endTime = new Date(Date.now());
                this.logger.error(`${endTime} - Call ended with error: APIAdapter@getItems`);
                cb(null, err);
            });
    }

    /** Requests & formats location data from Google Geocoding API */
    public getLocation(requestInfo: google.maps.GeocoderRequest, cb: AdapterCallback): void {
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call Starting: APIAdapter@getLocation`);

        if (!requestInfo.address) cb(null, 'No location provided');

        const geoCoder: GoogleMapsClient = createClient({
            key: process.env.GOOGLE_GEOLOCATION_KEY
        })
        
        geoCoder.geocode(requestInfo, (error, response) => {
            const locationResponse = formatLocationResponse(response.json.results);

            // log if any values are not defined
            if (locationResponse.lat === undefined 
                || locationResponse.lng === undefined 
                || !locationResponse.location) {
                this.logger.error('Invalid data format for API Adapter@getLocation', locationResponse);
            }
            if (error) {
                this.logger.error('Error: APIAdapter@getLocation');
                this.logger.error(error);
            }

            const endTime = new Date(Date.now());
            this.logger.debug(`${endTime} - Call ended: APIAdapter@getLocation`);
            cb(locationResponse, error);
        })

        /** Extract relevant data for location response 
         * Latitude and longitude are required inputs for DarkSky weather API
         * Formatted address is used in the UI to display the official location
        */
        // TODO: type arg as google.maps.GeocoderResult[] when @types/googlemaps is updated
        let formatLocationResponse = (response): appTypes.LocationResponse => {
            const time = new Date(Date.now());
            this.logger.debug(`${time} - Formatting location response`);

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
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call Starting: APIAdapter@getUser`);

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
                const endTime = new Date(Date.now());
                this.logger.debug(`${endTime} - 'Call ended: APIAdapter@getUser`);
                cb(user);
              })
              .catch(error => {
                const endTime = new Date(Date.now());
                this.logger.error(`${endTime} - 'Call ended with error: APIAdapter@getUser`);
                cb(null, error);
              })
        } else {
            const endTime = new Date(Date.now());
            this.logger.error(`${endTime} - Call ended with error: APIAdapter@getUser`);
            cb(null, 'No user provided - APIAdapter@getUser');
        }
    }

    /** Requests and formats weather forecast data from DarkSky Weather API */
    public getWeather(requestInfo: RequestInfo, cb: AdapterCallback): void {
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call Starting: APIAdapter@getWeather`);

        const { latitude, longitude } = requestInfo;

        // call DarkSky API
        const result = axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${latitude},${longitude}`)
            .then(response => {
                const weatherResponse = formatWeatherResponse(response);

                const endTime = new Date(Date.now());
                this.logger.debug(`${endTime} - Call ended: APIAdapter@getWeather`)
                cb(weatherResponse);
            })
            .catch(error => {
                const endTime = new Date(Date.now());
                this.logger.error(`${endTime} - Call ended with error: APIAdapter@getWeather`)
                cb(null, error);
            })

        /** Extract relevant data for daily weather forecast
         * See additional available properties at https://darksky.net/dev/docs#response-format
         */
        let formatWeatherResponse = (response): appTypes.WeatherResponse => {
            const time = new Date(Date.now());
            this.logger.debug(`${time} - Formatting location response`);

            const forecast = response.data.daily.data;

            return forecast.map(day => {
                return {
                    startTime: day.startTime,
                    startTimezone: response.data.startTimezone,
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
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call starting: APIAdapter@getWeatherSuggestions`);

        const { weatherId } = requestInfo;

        Suggestion.findAll({
            where: {
                weatherId
            }
        })
            .then(suggestions => {
                const endTime = new Date(Date.now());
                this.logger.debug(`${endTime} - Call ended: APIAdapter@getWeatherSuggestions`);
                cb(suggestions)
            })
            .catch(error => {
                const endTime = new Date(Date.now());
                this.logger.error(`${endTime} - Call ended with error: APIAdapter@getWeatherSuggestions`);
                cb(null, error);
            })
    }

    /** Updates default location for logged in user */
    public updateUserLocation(requestInfo: RequestInfo, cb: AdapterCallback): void {
        const startTime = new Date(Date.now());
        this.logger.debug(`${startTime} - Call Starting: APIAdapter@updateUserLocation`);

        if (requestInfo.user) {
            const { id } = requestInfo.user;
            const { latitude, longitude, location } = requestInfo;

            // sequelize findById method returns user for given ID
            User.findById(id)
                .then(user => user.update({ latitude, longitude, location }))
                .then(user => {
                    const endTime = new Date(Date.now());
                    this.logger.debug(`${endTime} - Call ended: APIAdapter@updateUserLocation`);
                    cb(user);
                })
                .catch(error => {
                    const endTime = new Date(Date.now());
                    this.logger.error(`${endTime} - Call ended with error: APIAdapter@updateUserLocation`);
                    cb(null, error);
                });
        } else {
            const endTime = new Date(Date.now());
            this.logger.error(`${endTime} - Call ended with error: APIAdapter@updateUserLocation`);
            cb(null, 'No user provided - APIAdapter@updateUserLocation');
        }
    }
}

/** Instantiates & returns the API Adapter class with dependencies */
export function createAPIAdapter(logger: Logger): ApiAdapter {
    let apiAdapter = new ApiAdapter(logger);

    return apiAdapter;
}

'use strict';

//#region ------------------------- Imports --------------------------
import { createClient } from '@google/maps';

//#endregion

//#region -------------------------- Types ----------------------------

/** Callback defined in the route controller
 * Logic to be performed on returned data and/or error
 */
export type AdapterCallback = (data: any, error: any) => void;

/** Request parameters for API */
export type RequestInfo = {
    [propNames: string]: any;
}

//#endregion

/**
 * Initial data request layer for all APIs
 */
class ApiAdapter {

    private geoCoder;

    constructor(
        private createClient: (options: any) => any
    ) {
        // create 
        this.geoCoder = this.createClient({
            key: process.env.GOOGLE_GEOLOCATION_KEY
        });
    }

    /** Requests & formats location data from Google Geocoding API */
    public getLocation(requestInfo: RequestInfo, cb: AdapterCallback): void {
        console.debug('Call Starting: apiAdapter getLocation');
        
        this.geoCoder.geocode(requestInfo, (error, response) => {
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

            console.debug('APIAdapter@getLocation - Call ended')
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
}

/** Instantiates & returns the API Adapter class with dependencies */
export function createAPIAdapter(): ApiAdapter {
    let apiAdapter = new ApiAdapter(createClient);

    return apiAdapter;
}

'use strict';

//#region ------------------------- Imports --------------------------
import { createClient } from '@google/maps';

//#endregion

//#region -------------------------- Types ----------------------------

export type AdapterCallback = (data: any, error: APIError) => void;

export type RequestInfo = {
    [propNames: string]: any;
}

export type APIError = {
    code?: number;
    message?: string;
    errorDetails?: any;
    apiErr: boolean;
}

//#endregion
/**
 * Initial data request layer for all APIs
 */
class ApiAdapter {

    private geoCoder;

    constructor(
        private createClient
    ) {
        this.geoCoder = this.createClient({
            key: process.env.GOOGLE_GEOLOCATION_KEY
        });
    }

    /** Requests  */
    public getLocation(requestInfo: RequestInfo, cb: AdapterCallback) {
        console.debug('Call Starting: apiAdapter getLocation');
        
        this.geoCoder.geocode(requestInfo, (error, response) => {
            const locationResponse = formatLocationResponse(response.json.results);
            // only send response if all values are defined
            if (locationResponse.lat === undefined 
                || locationResponse.lng === undefined 
                || !locationResponse.location) {
                console.debug('Invalid data format for API Adapter@getLocation');
            }
            if (error) {
                console.debug('Error: API Adapter@getLocation');
                console.debug(error);
            }

            console.debug('APIAdapter@getLocation - Call ended')
            cb(locationResponse, error);
        })

        /** Extract relevant data for location response */
        let formatLocationResponse = (response): appTypes.LocationResponse => { // TODO: type arg as google.maps.GeocoderResult[] when @types/googlemaps is updated
            console.debug('Formating location response', response[0].geometry.location);
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

export function createAPIAdapter(): ApiAdapter {
    let apiAdapter = new ApiAdapter(createClient);

    return apiAdapter;
}
import * as Express from 'express';

/**
 * API call control layer for all weather APIs
 */
namespace WeatherController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets weather forecast for a given latitude & longitude */
    export function getWeather(req: Express.Request, res: Express.Response, next?: Express.NextFunction): void {
        const apiAdapter = req.app.get('apiAdapter');

        const requestInfo = {
            latitude: req.query.latitude,
            longitude: req.query.longitude
        };

        apiAdapter.getWeather(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                console.error('Error happened while getting weather: getWeather');
                console.error(error);
            }
            res.status(200).send(data);
        }
    }

    // #endregion
}

export default WeatherController;
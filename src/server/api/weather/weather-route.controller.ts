import * as Express from 'express';

/**
 * API call control layer for all weather APIs
 */
namespace WeatherController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets weather forecast for a given latitude & longitude */
    export function getWeather(req: Express.Request, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: weather route @getWeather`);

        const requestInfo = {
            latitude: req.query.latitude,
            longitude: req.query.longitude
        };

        apiAdapter.getWeather(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while getting weather: getWeather');
                logger.error(error);
            }
            res.status(200).send(data);
        }
    }

    // #endregion
}

export default WeatherController;

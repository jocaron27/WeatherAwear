import * as Express from 'express';

/**
 * API call control later for all location APIs
 */
namespace LocationController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets latitude, longitude, and formatted address for a given location */
    export function getLocation(req: Express.Request, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: location route @getLocation`);
        
        const requestInfo = {
            address: req.query.location
        };

        apiAdapter.getLocation(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while getting location: getLocation');
                logger.error(error);
            }
            res.status(200).send(data);
        }
    }

    // #endregion
}

export default LocationController;

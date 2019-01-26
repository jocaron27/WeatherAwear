import * as Express from 'express';

/**
 * API call control later for all location APIs
 */
namespace LocationController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets latitude, longitude, and formatted address for a given location */
    export function getLocation(req: Express.Request, res: Express.Response, next?: Express.NextFunction): void {
        const apiAdapter = req.app.get('apiAdapter');

        const requestInfo = {
            address: req.query.location
        };

        apiAdapter.getLocation(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                console.error('Error happened while getting location: getLocation');
                console.error(error);
            }
            res.status(200).send(data);
        }
    }

    // #endregion
}

export default LocationController;
import * as Express from 'express';

/**
 * API call control layer for all apparel APIs
 */
namespace ApparelController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets all clothing items from database */
    export function getItems(req: Express.Request, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: apparel route @getItems`);

        apiAdapter.getItems(callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while getting apparel item: getItems');
                logger.error(error);
            }
            res.status(200).json(data);
        }
    }

    // #endregion
}

export default ApparelController;

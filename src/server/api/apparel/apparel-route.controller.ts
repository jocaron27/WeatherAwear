import * as Express from 'express';

/**
 * API call control layer for all apparel APIs
 */
namespace ApparelController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets all clothing items from database */
    export function getItems(req: Express.Request, res: Express.Response, next?: Express.NextFunction): void {
        const apiAdapter = req.app.get('apiAdapter');

        apiAdapter.getItems(callback);

        function callback(data, error?: any): void {
            if (error) {
                console.error('Error happened while getting apparel item: getItems');
                console.error(error);
            }
            res.status(200).json(data);
        }
    }

    // #endregion
}

export default ApparelController;
import * as Express from 'express';
import { Request } from 'express';

export interface IGetUserAuthInfoRequest extends Request {
    user: appTypes.User;
    login: appTypes.Login;
    logout: appTypes.Logout;
}

/**
 * API call control layer for all user APIs
 */
namespace UserController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets logged in user from database */
    export function getUser(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: user route @getUser`);

        const requestInfo = {
            user: req.user
        };

        apiAdapter.getUser(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while getting logged in user: getUser');
                logger.error(error);
            }
            res.status(200).json(data);
        }
    }

    /** Updates default location for logged in user */
    export function updateUserLocation(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: user route @updateUserLocation`);

        const requestInfo = {
            user: req.user,
            latitude: req.body.lat,
            longitude: req.body.lng,
            location: req.body.location
        };

        apiAdapter.updateUserLocation(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while updating user location: updateUserLocation');
                logger.error(error);
            }
            res.status(200).json(data);
        }
    }

    // #endregion
}

export default UserController;

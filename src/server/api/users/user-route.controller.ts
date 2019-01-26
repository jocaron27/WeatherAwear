import * as Express from 'express';
import { Request } from "express"
export interface IGetUserAuthInfoRequest extends Request {
  user: appTypes.User
}

/**
 * API call control layer for all user APIs
 */
namespace UserController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets logged in user from database */
    export function getUser(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const apiAdapter = req.app.get('apiAdapter');

        const requestInfo = {
            user: req.user
        }

        apiAdapter.getUser(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                console.error('Error happened while getting logged in user: getUser');
                console.error(error);
            }
            res.status(200).json(data);
        }
    }

    /** Updates default location for logged in user */
    export function updateUserLocation(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const apiAdapter = req.app.get('apiAdapter');

        const requestInfo = {
            user: req.user,
            latitude: req.body.lat,
            longitude: req.body.lng,
            location: req.body.location
        }

        apiAdapter.updateUserLocation(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                console.error('Error happened while updating user location: updateUserLocation');
                console.error(error);
            }
            res.status(200).json(data);
        }
    }

    // #endregion
}

export default UserController;
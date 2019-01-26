
import * as Express from 'express';
import { IGetUserAuthInfoRequest } from '../api/users/user-route.controller';

/**
 * API call control layer for all auth APIs
 */
namespace AuthController {

    // #region ---------------------------- APIs ------------------------------------

    /** Authenticates user email and password */
    export function authenticateUser(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const apiAdapter = req.app.get('apiAdapter');

        const requestInfo = {
            email: req.body.email,
            password: req.body.password
        }

        apiAdapter.authenticateUser(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                console.error('Error happened while authenticating user: authenticateUser');
                console.error(error);
            }
            req.login(data, err => (err ? next(err) : res.json(data)))
        }
    }

    /** Add new user to database and log in */
    export function createUser(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const apiAdapter = req.app.get('apiAdapter');

        const requestInfo = req.body;

        apiAdapter.createUser(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                console.error('Error happened while creating user: createUser');
                console.error(error);
            }
            req.login(data, err => (err ? next(err) : res.json(data)))
        }
    }

    /** Get user info */
    export function getUserInfo(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        console.debug('Getting user info');
        res.json(req.user);
    }

    /** Log out */
    export function logout(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        console.debug('Logging out');
        req.logout();
        res.redirect('/');
    }

    // #endregion
}

export default AuthController;


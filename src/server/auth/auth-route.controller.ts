
import * as Express from 'express';
import { IGetUserAuthInfoRequest } from '../api/users/user-route.controller';

/**
 * API call control layer for all auth APIs
 */
namespace AuthController {

    // #region ---------------------------- APIs ------------------------------------

    /** Authenticates user email and password */
    export function authenticateUser(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: auth route @authenticateUser`);

        const requestInfo = {
            email: req.body.email,
            password: req.body.password
        };

        apiAdapter.authenticateUser(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while authenticating user: authenticateUser');
                logger.error(error);
            }
            req.login(data, err => (err ? next(err) : res.json(data)));
        }
    }

    /** Add new user to database and log in */
    export function createUser(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: auth route @createUser`);

        const requestInfo = req.body;

        apiAdapter.createUser(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while creating user: createUser');
                logger.error(error);
            }
            req.login(data, err => (err ? next(err) : res.json(data)));
        }
    }

    /** Get user info */
    export function getUserInfo(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        logger.info(`${time} - ${method}: auth route @getUserInfo`);

        if (!req.user) logger.error('No user info available');

        res.json(req.user);
    }

    /** Log out */
    export function logout(req: IGetUserAuthInfoRequest, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        logger.info(`${time} - ${method}: auth route @logout`);
        
        req.logout();
        res.redirect('/');
    }

    // #endregion
}

export default AuthController;


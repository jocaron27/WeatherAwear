import * as Express from 'express';

/**
 * API call control layer for all suggestions APIs
 */
namespace SuggestionsController {

    // #region ---------------------------- APIs ------------------------------------

    /** Gets all weather-clothing suggestions from database */
    export function getAllSuggestions(req: Express.Request, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: suggestions route @getAllSuggestions`);
        
        apiAdapter.getAllSuggestions(callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while getting all suggestions: getAllSuggestions');
                logger.error(error);
            }
            res.status(200).json(data);
        }
    }

    /** Gets all weather-clothing suggestions from database, given weather category */
    export function getWeatherSuggestions(req: Express.Request, res: Express.Response, next?: Express.NextFunction): void {
        const method = req.method;
        const time = req['_startTime'];
        const logger = req.app.get('logger');
        const apiAdapter = req.app.get('apiAdapter');
        logger.info(`${time} - ${method}: suggestions route @getWeatherSuggestions`);

        const requestInfo = {
            weatherId: req.params.id
        };

        apiAdapter.getWeatherSuggestions(requestInfo, callback);

        function callback(data, error?: any): void {
            if (error) {
                logger.error('Error happened while getting suggestions for weather: getWeatherSuggestions');
                logger.error(error);
            }
            res.status(200).json(data);
        }
    }

    // #endregion
}

export default SuggestionsController;

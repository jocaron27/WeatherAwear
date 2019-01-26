
'use strict';

//#region ------------------------- Imports --------------------------

const chalk = require('chalk');

//#endregion

/**
 * Wrapper around chalk for server logging
 */
export class Logger {

    private errorColor = chalk.hex('#F5687B'); // red
    private debugColor = chalk.hex('#6C62A1'); // violet
    private infoColor = chalk.hex('#496981'); // blue

    constructor() {
        // empty constructor
    }

    log(arg1: any, arg2?: any) {
        console.log(...arguments);
    }

    debug(arg1: any, arg2?: any) {
        console.log(this.debugColor(...arguments));
    }

    info(arg1: any, arg2?: any) {
        console.log(this.infoColor(...arguments));
    }

    error(arg1: any, arg2?: any) {
        console.log(this.errorColor(...arguments));
    }

}

/** Instantiates & returns the Logger class */
export function createLogger(): Logger {
    let logger = new Logger();

    return logger;
}
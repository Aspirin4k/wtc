import {LoggerInterface} from "./LoggerInterface";
import {getConfigValue} from "../utils/config";

export class WinstonLogger implements LoggerInterface {
    private logger;

    constructor() {
        const winston = require('winston');

        const transports = [
            new winston.transports.File({
                filename: 'server.log',
                dirname: getConfigValue('logger_path')
            }),
        ]

        if ('dev' === getConfigValue('environment')) {
            transports.push(new winston.transports.Console());
        }

        this.logger = winston.createLogger({
            transports
        })
    }

    public error(message: string, val: object = {}): void {
        this.logger.error({
            context: val,
            message,
            date: (new Date()).toISOString()
        });
    }

    public info(message: string, val: object = {}): void {
        this.logger.info({
            context: val,
            message,
            date: (new Date()).toISOString()
        });
    }
}

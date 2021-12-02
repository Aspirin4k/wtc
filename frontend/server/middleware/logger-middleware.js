import {LoggerFactory} from "../../src/logger/LoggerFactory";

export const registerLoggerMiddleware = (app) => {
    app.use('*', (req, res, next) => {
        const context = {
            request: {
                url: req.originalUrl,
                method: req.method,
                params: req.params,
                query: req.query
            }
        };
        LoggerFactory.getLogger().info('Incoming request', context);

        res.on('finish', () => {
            context.response = {
                status: res.statusCode
            };
            LoggerFactory.getLogger().info('Response', context);
        })

        next();
    });
};

import { ErrorRequestHandler } from 'express';
import config from '../config';
import { errorLogger } from '../shared/logger';
import { IGenericErrorMessage } from '../interface/error.interface';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (config.env === 'development') {
        console.log(`🚀 Global Error ~ `, error);
    } else {
        errorLogger.error(`🚀 Global Error ~ `, error);
    }

    const statusCode = 500;
    let message = 'Something went wrong!';
    let errorMessages: IGenericErrorMessage[] = [];

    if (error instanceof Error) {
        message = error?.message;
        errorMessages = error?.message
            ? [
                  {
                      path: '',
                      message: error?.message,
                  },
              ]
            : [];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config.env !== 'production' ? error?.stack : undefined,
    });

    next();
};

export default globalErrorHandler;

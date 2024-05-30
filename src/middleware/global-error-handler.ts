import { ErrorRequestHandler } from 'express';
import config from '../config';
import { errorLogger } from '../shared/logger';
import { IGenericErrorMessage } from '../interface/error.interface';
import handleValidationError from '../error/handle-validation-error';
import { ZodError } from 'zod';
import ApiError from '../error/api-error';
import handleZodError from '../error/handle-zod-error';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (config.env === 'development') {
        console.log(`🚀 Global Error ~ `, error);
    } else {
        errorLogger.error(`🚀 Global Error ~ `, error);
    }

    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorMessages: IGenericErrorMessage[] = [];

    if (error?.name === 'ValidationError') {
        const simplifiedError = handleValidationError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    } else if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    } else if (error instanceof ApiError) {
        statusCode = error?.statuscode;
        message = error?.message;
        errorMessages = error?.message
            ? [
                  {
                      path: '',
                      message: error?.message,
                  },
              ]
            : [];
    } else if (error instanceof Error) {
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const logger_1 = require("../shared/logger");
const globalErrorHandler = (error, req, res, next) => {
    if (config_1.default.env === 'development') {
        console.log(`🚀 Global Error ~ `, error);
    }
    else {
        logger_1.errorLogger.error(`🚀 Global Error ~ `, error);
    }
    const statusCode = 500;
    let message = 'Something went wrong!';
    let errorMessages = [];
    if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.env !== 'production' ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
    next();
};
exports.default = globalErrorHandler;

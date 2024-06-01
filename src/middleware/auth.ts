import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import config from '../config';
import catchAsync from '../shared/catch-async-await';
import ApiError from '../error/api-error';
import { jwtHealers } from '../helper/jwt-helper';
import { Secret } from 'jsonwebtoken';
import { User } from '../app/modules/user/user.model';

export const auth = (...roles: string[]): RequestHandler =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // Get token form header

        const token = req.headers.authorization;
        if (!token) {
            next(
                new ApiError(httpStatus.UNAUTHORIZED, 'Authorization Invalid')
            );
        }

        // Decode token
        const decodedData = jwtHealers.verifyToken(
            token as string,
            config.jwt.secret as Secret
        );

        if (!decodedData) {
            next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
        }

        const isVerified = await User.isVerifiedUser(decodedData._id);
        if (!isVerified) {
            return next(
                new ApiError(
                    httpStatus.FORBIDDEN,
                    'Access Denied, Verify your email first'
                )
            );
        }

        req.user = decodedData;

        if (roles.length && !roles.includes(decodedData.role))
            return next(new ApiError(httpStatus.FORBIDDEN, 'Access Denied'));

        next();
    });

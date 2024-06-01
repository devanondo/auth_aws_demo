import { Request, RequestHandler, Response } from 'express';
import { AuthService } from './auth.service';
import config from '../../../config';
import { ILoginUserResponse } from './auth.interface';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catch-async-await';
import sendResponse from '../../../shared/send-response';
import { IUser } from '../user/user.interface';

const loginUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AuthService.loginUser(req.body);
        if (result?.refreshToken) {
            const { refreshToken, ...others } = result;

            // Set refresh token on cookie
            const options = {
                secure: config.env === 'production',
                httpOnly: true,
            };

            res.cookie('refreshToken', refreshToken, options);

            sendResponse<ILoginUserResponse | Record<string, string | boolean>>(
                res,
                {
                    statusCode: httpStatus.OK,
                    success: true,
                    message: 'Logged in successfully!',
                    data: others,
                }
            );
        } else {
            sendResponse<ILoginUserResponse | Record<string, string | boolean>>(
                res,
                {
                    statusCode: httpStatus.OK,
                    success: true,
                    message: 'Faild to login! verify your email first!',
                    data: result,
                }
            );
        }
    }
);

const sendOtp: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.sendOtp(payload);

        sendResponse<null>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'OTP Sended!',
            data: null,
        });
    }
);

const changePassword: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.changePassword(payload);

        sendResponse<Record<string, unknown>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Password changed',
            data: result,
        });
    }
);

const verifyUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.verifyUser(payload);

        sendResponse<Record<string, unknown>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Verified Sucessfully',
            data: result,
        });
    }
);

const getLoggedInUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AuthService.getLoggedInUser(req);

        sendResponse<Partial<IUser>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User retrived successfully!',
            data: result,
        });
    }
);

export const AuthController = {
    loginUser,
    sendOtp,
    changePassword,
    verifyUser,
    getLoggedInUser,
};

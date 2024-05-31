import jwt, { Secret } from 'jsonwebtoken';
import config from '../config';
import ApiError from '../error/api-error';
import httpStatus from 'http-status';

export const verifyOtp = async (otp: string, token: string) => {
    try {
        const decodedData: any = await jwt.verify(
            token,
            config.jwt.secret as Secret
        );

        return decodedData.otp === otp;
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Timed out');
    }
};

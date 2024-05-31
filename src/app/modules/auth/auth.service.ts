import httpStatus from 'http-status';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../error/api-error';
import { User } from '../user/user.model';
import { jwtHealers } from '../../../helper/jwt-helper';
import { generateOtp } from '../../../helper/otp-generator';
import { sendEmail } from '../../../helper/send-email';
import { verifyOtp } from '../../../helper/verify-otp';
import bcrypt from 'bcrypt';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { password, id } = payload;

    if (!id) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Some information missing, Try again!'
        );
    }

    const isUserExist = await User.isUserExist(id);

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isMatchedPassword = await User.isPasswordMatched(
        password,
        isUserExist.password
    );

    if (isUserExist?.password && !isMatchedPassword) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Password');
    }
    const { role, _id, email, username } = isUserExist;

    if (!isUserExist.is_verified) {
        const otp = generateOtp(6);

        // Generate token
        const token = jwtHealers.createToken(
            {
                email,
                otp,
            },
            config.jwt.secret as Secret,
            300
        );

        await User.findOneAndUpdate({ email }, { token }, { new: true });

        await sendEmail({
            to: email,
            subject: 'Verification OTP',
            html: otp,
        });

        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Please verify your email first, We send OTP on your email'
        );
    }

    // Generate access token
    const accessToken = jwtHealers.createToken(
        {
            email,
            role,
            _id,
            username,
        },
        config.jwt.secret as Secret,
        config.jwt.exprire_in as string
    );

    // Generate refresh token
    const refreshToken = jwtHealers.createToken(
        {
            email,
            role,
            _id,
            username,
        },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_exprire_in as string
    );

    return {
        accessToken,
        refreshToken,
    };
};

// Forgot password and send otp to the email address
const sendOtp = async (payload: { email: string }) => {
    const { email } = payload;

    const user = await User.isUserExist(email);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }
    const otp = generateOtp(6);

    // Generate token
    const token = jwtHealers.createToken(
        {
            email,
            otp,
        },
        config.jwt.secret as Secret,
        300
    );

    const istoken = await User.findOneAndUpdate(
        { email },
        { token },
        { new: true }
    );

    if (!istoken) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Faild to request otp');
    }
    await sendEmail({
        to: email,
        subject: 'Verification OTP',
        html: otp,
    });
};

// Change password with valid otp
const changePassword = async (payload: {
    email: string;
    otp: string;
    password: string;
}) => {
    const { email, otp, password } = payload;

    const user = await User.isUserExist(email);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isVeirfiedOTP = await verifyOtp(otp, user.token as string);

    if (!isVeirfiedOTP) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
    }

    const isHashPassword = await bcrypt.hash(
        password,
        Number(config.bycrypt_salt_rounds)
    );

    // change the password
    const isChangePassword = await User.findOneAndUpdate(
        { email },
        { password: isHashPassword },
        { new: true }
    );

    if (!isChangePassword) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Failed to change password'
        );
    }

    return {
        success: true,
        redirect: '/login',
    };
};

// Verify user with otp
const verifyUser = async (payload: {
    email: string;
    otp: string;
}): Promise<Record<string, unknown>> => {
    const { email, otp } = payload;

    const user = await User.isUserExist(email);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isVeirfiedOTP = await verifyOtp(otp, user.token as string);

    if (!isVeirfiedOTP) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
    }

    // change the verification status
    const isUserVerified = await User.findOneAndUpdate(
        { email },
        { is_verified: true },
        { new: true }
    );

    if (!isUserVerified) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Faild to verify user');
    }

    return {
        success: true,
        redirect: '/login',
    };
};

export const AuthService = {
    loginUser,
    sendOtp,
    changePassword,
    verifyUser,
};

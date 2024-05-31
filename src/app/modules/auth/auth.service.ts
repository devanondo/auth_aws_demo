import httpStatus from 'http-status';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../error/api-error';
import { User } from '../user/user.model';
import { jwtHealers } from '../../../helper/jwt-helper';

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

export const AuthService = {
    loginUser,
};

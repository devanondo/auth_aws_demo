/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
    username: string;
    role?: 'superadmin' | 'admin';
    phone?: string;
    password: string;
    email: string;
    name: string;
    is_verified?: boolean;
    is_deleted?: boolean;
    token?: string;
    _id?: string;
};

export type UserModel = {
    isUserExist(
        key?: string
    ): Promise<
        Pick<
            IUser,
            | '_id'
            | 'email'
            | 'username'
            | 'role'
            | 'password'
            | 'token'
            | 'is_verified'
        >
    >;
    isPasswordMatched(
        givenPassword: string,
        savedPassword: string
    ): Promise<boolean>;
} & Model<IUser>;

export type IUserFilters = {
    searchTerm?: string;
    email?: string;
    phone?: string;
    role?: string;
    username?: string;
};

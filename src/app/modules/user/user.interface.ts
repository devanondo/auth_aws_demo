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
    _id?: string;
};

export type UserModel = {
    isUserExist(
        key?: string
    ): Promise<Pick<IUser, '_id' | 'email' | 'username' | 'role' | 'password'>>;
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

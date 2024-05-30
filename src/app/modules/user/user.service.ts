import httpStatus from 'http-status';
import { Schema, SortOrder } from 'mongoose';
import ApiError from '../../../error/api-error';
import { paginationHelpers } from '../../../helper/paginationHelper';
import { IGenericResponse } from '../../../interface/common.inteface';
import { IPaginationOptions } from '../../../middleware/paginationOptions';
import { userFilterableFields } from './user.constants';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';
import { Request } from 'express';

// Create user | Register User
const createAdmin = async (user: IUser): Promise<IUser | null> => {
    const newuser = await User.create({
        ...user,
    });

    return newuser;
};

// Get all users with filters and paginations
const getUsers = async (
    filters: IUserFilters,
    pagination: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const { searchTerm, ...filtersData } = filters;

    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: userFilterableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // Filters needs $and to fullfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const sortValue = sortOrder === 'ascending' || sortOrder === 'asc' ? 1 : -1;

    const filterConditions = [
        {
            $match: whereConditions,
        },
    ];

    const users = await User.aggregate([
        ...filterConditions,
        {
            $sort: {
                [sortBy]: sortValue,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);

    const total = await User.aggregate([...filterConditions]);

    return {
        meta: {
            page,
            limit,
            total: total.length,
        },
        data: users,
    };
};

// Get single user --> superadmin | admin
const getSingleUsers = async (id: string): Promise<IUser | null> => {
    const user = await User.findById(id);

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not round!');

    return user;
};

// Update user
const updateUser = async (
    id: string,
    payload: Partial<IUser>
): Promise<IUser | null> => {
    if (payload.password) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'You are not allowed to update password!'
        );
    }

    const user = await User.findOneAndUpdate(
        { _id: id },
        { ...payload },
        { new: true }
    );

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');

    return user;
};

// Update user
const deleteUser = async (id: string, req: Request): Promise<IUser | null> => {
    deletePermission(id, req);

    const isDeleteUser = await User.findOneAndUpdate(
        { _id: id },
        {
            is_deleted: true,
        },
        { new: true }
    );

    if (!isDeleteUser)
        throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Faild to delete!');

    return isDeleteUser;
};

// Trush user
const trushUser = async (id: string, req: Request): Promise<IUser | null> => {
    deletePermission(id, req);

    const isDeleteUser = await User.findOneAndDelete({ _id: id });

    if (!isDeleteUser)
        throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Faild to remove!');

    return isDeleteUser;
};

const deletePermission = (id: string, req: Request) => {
    if (id.toString() === req?.user?._id?.toString()) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'You are not allowed to delete yourself!'
        );
    }
};

export const UserService = {
    createAdmin,
    getUsers,
    getSingleUsers,
    updateUser,
    deleteUser,
    trushUser,
};

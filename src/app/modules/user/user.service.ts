import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../error/api-error';
import { paginationHelpers } from '../../../helper/paginationHelper';
import { IGenericResponse } from '../../../interface/common.inteface';
import { IPaginationOptions } from '../../../middleware/paginationOptions';
import { userFilterableFields } from './user.constants';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';

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

// Get single user --> customer | admin | vendor
const getSingleUsers = async (id: string): Promise<IUser | null> => {
    const user = await User.aggregate([
        {
            $match: {
                userid: id,
            },
        },
    ]);

    if (!user.length)
        throw new ApiError(httpStatus.NOT_FOUND, 'User not round!');

    return user[0];
};

// Update user
const updateUser = async (
    id: string,
    payload: Partial<IUser>
): Promise<IUser | null> => {
    const user = await User.findOneAndUpdate(
        { userid: id },
        { ...payload },
        { new: true }
    );

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');

    return user;
};

export const UserService = {
    createAdmin,
    getUsers,
    getSingleUsers,
    updateUser,
};

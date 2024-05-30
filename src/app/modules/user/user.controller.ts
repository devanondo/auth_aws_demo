import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationQueryOptions } from '../../../middleware/paginationOptions';
import catchAsync from '../../../shared/catch-async-await';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/send-response';
import { userFilterableFields } from './user.constants';
import { IUser } from './user.interface';
import { UserService } from './user.service';

// Create user | Register user --> customer | admin | vendor
const createAdmin: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.body;
        const result = await UserService.createAdmin(user);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Admin Created Successfully',
            data: result,
        });
    }
);

// Get users --> customer | admin | vendor
const getUsers: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, userFilterableFields);

        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await UserService.getUsers(filters, paginationOptions);

        sendResponse<IUser[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Users Retrived Successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

// Get single user --> customer | admin | vendor
const getSingleUsers: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await UserService.getSingleUsers(id);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User Retrived Successfully',
            data: result,
        });
    }
);

// Update user info --> AMDIN | SUPERADMIN
const updateUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const updateData = req.body;

        const result = await UserService.updateUser(id, updateData);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User updated Successfully',
            data: result,
        });
    }
);

// Delete user --> AMDIN | SUPERADMIN
const deleteUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await UserService.deleteUser(id, req);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User Deleted Successfully',
            data: result,
        });
    }
);

// removed user from database --> AMDIN | SUPERADMIN
const trushUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await UserService.trushUser(id, req);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User Removed Successfully',
            data: result,
        });
    }
);

export const UserController = {
    createAdmin,
    updateUser,
    getSingleUsers,
    getUsers,
    deleteUser,
    trushUser,
};

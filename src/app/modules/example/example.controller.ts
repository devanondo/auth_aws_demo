import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catch-async-await';
import sendResponse from '../../../shared/send-response';
import { db } from '../../../lib/db';

// Create a new example
const createExample: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const user = await db.user.create({
            data: {
                name: 'Alice',
                email: 'alice@prisma.io',
            },
        });
        sendResponse<Record<string, unknown>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Exmaple Created Successfully',
            data: user,
        });
    }
);

const getExample: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const user = await db.user.findMany();
        sendResponse<Record<string, unknown>[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Exmaple Created Successfully',
            data: user,
        });
    }
);
export const ExampleController = {
    createExample,
    getExample,
};

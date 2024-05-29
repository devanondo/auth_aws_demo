import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catch-async-await';
import sendResponse from '../../../shared/send-response';

const getExample: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        
        sendResponse<Record<string, unknown>[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Exmaple Created Successfully',
            data: [{status:"okay"}],
        });
    }
);
export const ExampleController = {

    getExample,
};

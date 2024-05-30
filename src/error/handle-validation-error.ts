import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interface/common.inteface';
import { IGenericErrorMessage } from '../interface/error.interface';

const handleValidationError = (
    error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
        (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return { path: el?.path, message: el?.message };
        }
    );

    return {
        statusCode: 400,
        message: 'Validation Error',
        errorMessages: errors,
    };
};

export default handleValidationError;

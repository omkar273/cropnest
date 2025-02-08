import { Request } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from './api_error.js';

export const validateRequest = (req: Request) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.array().map((error: any) => ({
            type: 'field',
            value: error.value,
            msg: error.msg,
            path: error.param,
            location: error.location,
        }));
        console.log(errors);
        const errorMessage = errors.map((error) => ` ${error.msg}`).join(', ');
        throw new ApiError(`Validation failed: ${errorMessage}`, 400);
    }
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import getModelByRole from './../controllers/auth/utils/get_model_by_role.js';
import { IToken } from './../controllers/auth/utils/generate_tokens.js';
import { asyncHandler, ApiError } from '../utils/index.js';
import { Agent } from '../models/index.js';

/**
 * Middleware to verify JSON Web Token (JWT) from cookies or authorization headers.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @throws {ApiError} If the access token is missing or invalid.
 *
 * @description
 * This middleware extracts the JWT from the request's cookies or authorization headers.
 * It verifies the token using the secret key specified in the environment variable `ACCESS_TOKEN_SECRET`.
 * If the token is valid, it checks if the device information in the token matches the request's user-agent.
 * If the device information matches, it retrieves the user from the database based on the role and ID in the token.
 * If the user is found, it attaches the user to the request object and calls the next middleware.
 * If any of these checks fail, it throws an `ApiError`.
 */
export const verifyJwt = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ApiError('Missing Acess Token', 401);
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        ) as IToken;

        console.log(
            '🚀 ~ file: auth.middleware.ts ~ line 57 ~ decoded',
            decoded
        );
        console.log(
            '🚀 ~ file: auth.middleware.ts ~ line 57 ~ req.headers',
            req.headers['user-agent']
        );

        const isSameDevice = req.headers['user-agent'] === decoded?.deviceInfo;

        // if (!isSameDevice) {
        //   throw new ApiError("Unauthorized Request", 401);
        // }

        const Model: any = getModelByRole(decoded?.role) || Agent;
        const user = await Model.findById(decoded?.id).select();

        if (!user) {
            throw new ApiError('Invalid Token', 401);
        }

        req.user = user;
        next();
    }
);

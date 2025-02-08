import jwt from 'jsonwebtoken';
import { ApiError } from './../../../utils/index.js';
import { RefreshToken } from '../../../models/index.js';

/**
 * Interface representing a token.
 *
 * @interface IToken
 * @property {string} id - The unique identifier for the token.
 * @property {string} role - The role associated with the token.
 * @property {string} deviceInfo - Information about the device associated with the token.
 */
export interface IToken {
    id: string;
    role: string;
    deviceInfo: string;
}

/**
 * Generates an access token for a given user ID.
 *
 * @param {string} userId - The ID of the user for whom the access token is being generated.
 * @returns {Promise<string>} A promise that resolves to the generated access token.
 * @throws {ApiError} Throws an error if token generation fails.
 */
export const generateAccessToken = async ({
    role,
    id,
    deviceInfo,
}: IToken): Promise<string> => {
    try {
        const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
        const access_token_expiry = process.env.ACCESS_TOKEN_EXPIRY;

        const accessToken = jwt.sign(
            { id, role, deviceInfo },
            access_token_secret,
            {
                expiresIn: access_token_expiry,
            }
        );

        return accessToken;
    } catch (error) {
        throw new ApiError(
            `Something Went Wrong While Generating Access Token: ${error}`,
            500
        );
    }
};

/**
 * Generates a refresh token for a user.
 *
 * @param {Object} params - The parameters for generating the refresh token.
 * @param {string} params.id - The user's ID.
 * @param {string} params.role - The user's role.
 * @param {Object} params.deviceInfo - Information about the user's device.
 * @returns {Promise<string>} The generated refresh token.
 * @throws {ApiError} If the refresh token secret or expiry time is not defined, or if an error occurs during token generation.
 */
export const generateRefreshToken = async ({
    id,
    role,
    deviceInfo,
}: IToken): Promise<string> => {
    try {
        const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;
        const refresh_token_expiry = process.env.REFRESH_TOKEN_SECRET_EXPIRY;

        if (!refresh_token_secret || !refresh_token_expiry) {
            throw new ApiError(
                'Refresh token secret or expiry time not defined',
                500
            );
        }

        const payload = {
            id,
            role,
            deviceInfo,
        };

        const refreshToken = jwt.sign(payload, refresh_token_secret, {
            expiresIn: refresh_token_expiry,
        });

        await RefreshToken.create({
            token: refreshToken,
            userId: id,
            role,
            deviceInfo,
        });

        return refreshToken;
    } catch (error) {
        console.error('Error generating refresh token:', error);

        throw new ApiError(
            `Something went wrong while generating the refresh token: ${error.message}`,
            500
        );
    }
};

import { CookieOptions, Request, Response } from 'express';

import {
    generateAccessToken,
    generateRefreshToken,
} from './utils/generate_tokens.js';
import verifyOtp from '../otp/verify_otp.js';
import { asyncHandler, ApiResponse, ApiError } from '../../utils/index.js';
import { Agent } from '../../models/index.js';
import { UserRoles } from '../../core/constants/enums/user_roles.js';

/**
 * @swagger
 * /auth/login-agent:
 *   post:
 *     summary: Login an agent using phone and OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "7038823053"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "679400be1de455660f763c88"
 *                         name:
 *                           type: string
 *                           example: "jagdish"
 *                         email:
 *                           type: string
 *                           example: "omkr@gmail.com"
 *                         phone:
 *                           type: string
 *                           example: "7038823053"
 *                         adhaar:
 *                           type: string
 *                           example: "123456789125"
 *                         isVerified:
 *                           type: boolean
 *                           example: false
 *                         status:
 *                           type: string
 *                           example: "active"
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Phone or email is required"
 *                 success:
 *                   type: boolean
 *                   example: false
 *       303:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 303
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *                 success:
 *                   type: boolean
 *                   example: false
 */
export const loginAgent = asyncHandler(async (req: Request, res: Response) => {
    const { phone, otp } = req.body;
    if (!phone) {
        throw new ApiError('Phone or email is required', 400);
    }

    const isValidOtp = await verifyOtp(phone, otp);
    if (!isValidOtp) {
        throw new ApiError('Invalid OTP', 400);
    }

    const user = await Agent.findOne({
        phone,
    }).select('-createdAt -updatedAt -__v ');

    if (!user) {
        throw new ApiError('User does not exist', 303);
    }

    const payload = {
        role: UserRoles.AGENT,
        id: user._id.toString(),
        deviceInfo: req.headers['user-agent'],
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        // expires: new Date(Date.now() + * 24 * 60 * 60 * 1000),
    };

    res.status(200)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .cookie('accessToken', accessToken, cookieOptions)
        .json(
            new ApiResponse(
                { accessToken, refreshToken, user },
                'User logged in successfully',
                200
            )
        );
});

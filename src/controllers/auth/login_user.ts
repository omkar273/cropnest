import { CookieOptions, Request, Response } from 'express';

import {
    generateAccessToken,
    generateRefreshToken,
} from './utils/generate_tokens.js';
import getModelByRole from './utils/get_model_by_role.js';
import verifyOtp from '../otp/verify_otp.js';
import { asyncHandler, ApiResponse, ApiError } from '../../utils/index.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: string
 *       enum:
 *         - Vendor
 *         - Customer
 *         - Admin
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user with phone and OTP
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Role
 *         required: true
 *         schema: { "$ref": "#/components/schemas/Role" }
 *         description: Role of the user (e.g., Vendor)
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
 *                           example: "675406aee1a646222bdb1805"
 *                         fullname:
 *                           type: string
 *                           example: "omkar sonawane"
 *                         email:
 *                           type: string
 *                           example: "omkarsonawane5@gmail.com"
 *                         phone:
 *                           type: string
 *                           example: "7038823053"
 *                         referralCode:
 *                           type: string
 *                           example: "692713"
 *                         salons:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               salon_id:
 *                                 type: string
 *                                 example: "675406aee1a646222bdb1801"
 *                               role:
 *                                 type: string
 *                                 example: "owner"
 *                               permissions:
 *                                 type: string
 *                                 example: "675406aee1a646222bdb1803"
 *                         account_status:
 *                           type: string
 *                           example: "pending"
 *                         createdAt:
 *                           type: string
 *                           example: "2024-12-07T08:26:22.990Z"
 *                         updatedAt:
 *                           type: string
 *                           example: "2024-12-07T20:01:27.045Z"
 *                         __v:
 *                           type: integer
 *                           example: 2
 *                     role:
 *                       type: string
 *                       example: "Vendor"
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
 *                 message:
 *                   type: string
 *                   example: "Role is required"
 *                 success:
 *                   type: boolean
 *                   example: false
 */

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const role = req.role;
    if (!role) {
        throw new ApiError('Role is required', 400);
    }

    const { phone, email, otp } = req.body;

    if (!phone && !email) {
        throw new ApiError('Phone or email is required', 400);
    }

    const isValidOtp = await verifyOtp(phone, otp);
    if (!isValidOtp) {
        throw new ApiError('Invalid OTP', 400);
    }

    const Model: any = getModelByRole(role);

    const user = await Model.findOne({
        $or: [{ email: email }, { phone: phone }],
    });

    if (!user) {
        throw new ApiError('User does not exist', 303);
    }

    const payload = {
        role,
        id: user._id,
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
                { accessToken, refreshToken, user, role },
                'User logged in successfully',
                200
            )
        );
});

import { Request, Response, NextFunction } from 'express';
import { asyncHandler, ApiResponse } from '../../utils/index.js';
import { RefreshToken } from '../../models/index.js';

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out the authenticated user
 *     description: Deletes the user's refresh token and clears the authentication cookies.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User logged out successfully
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
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: User logged out successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export const logoutUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        await RefreshToken.deleteOne({ userId: user._id });

        res.status(200)
            .clearCookie('refreshToken')
            .clearCookie('accessToken')
            .json(new ApiResponse({}, 'User logged out successfully', 200));
    }
);

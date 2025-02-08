import { Request, Response, NextFunction } from 'express';

import { asyncHandler, ApiResponse } from '../../utils/index.js';

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get user information
 *     description: Fetches the details of the authenticated user.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User fetched successfully
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
 *                     _id:
 *                       type: string
 *                       example: 67a7375ee85847afbf106c6d
 *                     name:
 *                       type: string
 *                       example: jagdish
 *                     email:
 *                       type: string
 *                       example: omk54r@gmail.com
 *                     phone:
 *                       type: string
 *                       example: 9511791441
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: string
 *                       example: active
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-02-08T10:52:14.140Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-02-08T10:52:14.140Z
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    res.status(200).json(
        new ApiResponse(user, 'User fetched successfully', 200)
    );
});

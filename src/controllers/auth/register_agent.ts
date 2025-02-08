import { Request, Response } from 'express';
import { Agent, IAgent } from '../../models/index.js';
import {
    asyncHandler,
    ApiResponse,
    validateRequest,
} from '../../utils/index.js';
import { body } from 'express-validator';

export const registerAgentValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email'),
    body('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .isMobilePhone('en-IN')
        .withMessage('Invalid phone number'),
    body('otp').notEmpty().withMessage('OTP is required'),
];

/**
 * @swagger
 * /auth/register-agent:
 *   post:
 *     summary: Register a new agent
 *     description: Register a new agent with name, phone, email, and adhaar.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - adhaar
 *               - otp
 *               - adhaarUrl
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: jagdish
 *               phone:
 *                 type: string
 *                 example: 7038823053
 *               email:
 *                 type: string
 *                 example: omkr@gmail.com
 *               otp:
 *                type: string
 *                example: 123456
 *     responses:
 *       201:
 *         description: Agent registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: Agent registered
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Agent already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agent already exists
 *                 success:
 *                   type: boolean
 *                   example: false
 */
export const registerAgent = asyncHandler(
    async (req: Request, res: Response) => {
        validateRequest(req);

        const { name, phone, email } = req.body as IAgent;

        const existingAgent = await Agent.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingAgent) {
            throw new ApiResponse(400, 'Agent already exists');
        }

        const agent = new Agent({
            name,
            phone,
            email,
        });

        await agent.save();

        res.status(201).json(new ApiResponse({}, 'Agent registered'));
    }
);

import { asyncHandler, ApiResponse, ApiError } from '../../utils/index.js';
import { Otp } from '../../models/index.js';

const generateOtp = (length = 6) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10); // Random digit (0-9)
    }
    return otp;
};

/**
 * Sends an OTP (One-Time Password) to the user's phone number.
 *
 * This function validates the phone number from the request body, checks if an OTP already exists and is not expired,
 * generates a new OTP if necessary, and sends it to the user's phone number using an SMS API (currently logged to the console).
 * The OTP is then saved to the database with a 3-minute expiry time.
 *
 * @param {Request} req - The request object containing the phone number in the body.
 * @param {Response} res - The response object used to send the response back to the client.
 *
 * @throws {ApiError} If the phone number is not provided or if an OTP already exists and is not expired.
 *
 * @returns {Promise<void>} A promise that resolves when the OTP is successfully sent and saved to the database.
 */

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Sends an OTP to the user's phone number.
 *     description: Validates the phone number, generates an OTP, sends it via SMS, and saves it to the database.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "7038823053"
 *     responses:
 *       200:
 *         description: OTP sent successfully
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
 *                     phone:
 *                       type: string
 *                       example: "7038823053"
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
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
 *                   example: "Phone number is required"
 *                 success:
 *                   type: boolean
 *                   example: false
 */

const sendOtp = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    // Validate phone number
    if (!phone) {
        throw new ApiError('Phone number is required', 400);
    }

    const existingOtp = await Otp.findOne({
        phone,
        expires: { $gt: new Date() },
    });
    if (existingOtp) {
        const remainingTime = Math.ceil(
            (existingOtp.expires.getTime() - Date.now()) / 1000 / 60
        );
        throw new ApiError(
            `You can request a new OTP after ${remainingTime} minutes`,
            400
        );
    }

    // Generate a new OTP
    // const otp = generateOtp(6);
    const otp = '123456';

    // TODO: Use an SMS API to send the OTP. Remove this in production.
    console.log(`OTP for phone ${phone}: ${otp}`);

    // Save the OTP to the database
    const expiryTime = new Date(Date.now() + 3 * 60 * 1000);
    await Otp.create({ phone, otp, expires: expiryTime });

    res.status(200).json(
        new ApiResponse({ phone }, 'OTP sent successfully', 200)
    );
});

export { sendOtp };

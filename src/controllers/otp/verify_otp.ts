import { Otp } from '../../models/index.js';
import { ApiError } from './../../utils/index.js';

/**
 * Verifies the provided OTP for the given phone number.
 *
 * @param phone - The phone number to verify the OTP against.
 * @param otp - The OTP to be verified.
 * @returns A promise that resolves to a boolean indicating whether the OTP is valid.
 * @throws {ApiError} If the OTP is invalid or expired.
 */
const verifyOtp = async (phone: string, otp: string): Promise<boolean> => {
    const existingOtp = await Otp.findOne({
        phone,
        expires: { $gt: new Date() },
    });

    console.log('otp', existingOtp);

    if (!existingOtp || existingOtp.otp !== otp) {
        throw new ApiError('Invalid or expired OTP', 400);
    }

    await existingOtp.deleteOne();

    return true;
};

export default verifyOtp;

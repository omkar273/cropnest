import { randomBytes } from 'crypto';
import getModelByRole from './get_model_by_role.js';

const generateReferralCode = async (
    length: number = 6,
    maxRetries: number = 10,
    role: string = 'user'
): Promise<string> => {
    let referralCode = '';
    let retries = 0;

    // Keep generating a new referralCode until it's unique or maxRetries is reached
    while (retries < maxRetries) {
        const randomValue = randomBytes(Math.ceil(length / 2)).toString('hex'); // Generate a hex string with the desired length
        referralCode = randomValue.toUpperCase();

        // Check if the generated code already exists
        // TODO: Check if the referral code is unique across all user types
        // TODO: Add dynamic role to check for that collection
        const Model: any = getModelByRole(role);
        const existingUser = await Model.findOne({ referralCode });

        // If it's unique, break the loop
        if (!existingUser) {
            return referralCode;
        }

        retries++;
    }

    // If we exceed the maxRetries, throw an error or handle accordingly
    throw new Error(
        'Failed to generate a unique referral code after maximum retries'
    );
};

export default generateReferralCode;

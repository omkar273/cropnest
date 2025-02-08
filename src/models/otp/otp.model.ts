import { Schema, model, Document } from 'mongoose';

interface IOtp extends Document {
    phone: string;
    otp: string;
    expires: Date;
    createdAt: Date;
    updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
    {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        otp: {
            type: String,
            required: [true, 'OTP is required'],
        },
        expires: {
            type: Date,
            default: () => new Date(Date.now() + 3 * 60 * 1000),
        },
    },
    {
        timestamps: true,
    }
);

// Set TTL (Time To Live) for OTP expiration after 3 minutes
otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Create and export the OTP model
const Otp = model<IOtp>('Otp', otpSchema);

export default Otp;

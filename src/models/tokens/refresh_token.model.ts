import { model, Schema } from 'mongoose';
import { IToken } from './../../controllers/auth/utils/generate_tokens.js';

const refreshTokenSchema = new Schema(
    {
        role: { type: String, required: true },
        userId: { type: Schema.Types.Mixed, required: true },
        deviceInfo: { type: String, required: true },
        token: { type: String, required: true },
    },
    { timestamps: true }
);

const RefreshToken = model<IToken>('RefreshToken', refreshTokenSchema);
export { RefreshToken };

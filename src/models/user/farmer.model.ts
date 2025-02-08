import { model, Schema } from 'mongoose';

export interface IAgent extends Document {
    name: string;
    email: string;
    phone: string;
    isVerified?: boolean;
    lastSignedIn?: Date;
    status?: 'active' | 'inactive' | 'suspended';
    metadata?: Map<string, string>;
}

export enum AgentStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

const agentSchema = new Schema<IAgent>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        lastSignedIn: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
        },

        metadata: {
            type: Map,
            of: String,
        },
    },
    { timestamps: true }
);

const Agent = model('Agent', agentSchema);
export default Agent;

import { Schema, model, Document, Types } from 'mongoose';

interface IFieldResponse {
    key: string;
    type:
        | 'text'
        | 'date'
        | 'number'
        | 'document'
        | 'boolean'
        | 'select'
        | 'multiselect';
    value: string | number | boolean | Date | Types.ObjectId | string[];
}

interface IPolicyApplication extends Document {
    policyId: Types.ObjectId; // Reference to the policy
    userId: Types.ObjectId; // If user authentication exists, link to the user
    fieldResponses: IFieldResponse[];
    submittedAt: Date;
}

const fieldResponseSchema = new Schema<IFieldResponse>({
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
});

const policyResponseSchema = new Schema<IPolicyApplication>(
    {
        policyId: {
            type: Schema.Types.ObjectId,
            ref: 'Policy',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            // ref: 'User',
            required: false,
        },
        fieldResponses: { type: [fieldResponseSchema], required: true },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const PolicyApplication = model<IPolicyApplication>(
    'PolicyApplication',
    policyResponseSchema
);

export default PolicyApplication;

import { Schema, model, Document } from 'mongoose';

export enum PolicyFieldType {
    Text = 'text',
    Date = 'date',
    Number = 'number',
    Document = 'document',
    Boolean = 'boolean',
    Select = 'select',
    Multiselect = 'multiselect',
}

interface IPolicyField {
    key: string;
    name: string;
    type:
        | 'text'
        | 'date'
        | 'number'
        | 'document'
        | 'boolean'
        | 'select'
        | 'multiselect';
    description?: string;
    exampleUrl?: string;
    required: boolean;
    options?: string[];
    fileType?: string;
    min?: number;
    max?: number;
}

interface IPolicy extends Document {
    title: string;
    description: string;
    requirements: IPolicyField[];
    targetAudience: string;
    expiryDate?: Date;
    validityPeriod?: { start: Date; end: Date };
    createdAt: Date;
    updatedAt: Date;
    rules: string[];
    created_by: Schema.Types.ObjectId;
}

const policyFieldSchema = new Schema<IPolicyField>({
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: {
        type: String,
        enum: [
            'text',
            'date',
            'number',
            'document',
            'boolean',
            'select',
            'multiselect',
        ],
        required: true,
    },
    description: { type: String, default: undefined },
    exampleUrl: {
        type: String,
        validate: {
            validator: function (this: IPolicyField) {
                return (
                    this.type !== 'document' ||
                    (this.type === 'document' && !!this.exampleUrl)
                );
            },
            message: "exampleUrl is required when type is 'document'.",
        },
    },
    required: { type: Boolean, required: true },
    options: {
        type: [String],
        default: undefined,
        validate: {
            validator: function (this: IPolicyField) {
                return (
                    !(this.type === 'select' || this.type === 'multiselect') ||
                    (this.options && this.options.length > 0)
                );
            },
            message:
                "options must be provided when type is 'select' or 'multiselect'.",
        },
    },
    fileType: { type: String, default: undefined },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
});

const policySchema = new Schema<IPolicy>(
    {
        rules: { type: [String], default: undefined },
        title: { type: String, required: true },
        description: { type: String, required: true },
        requirements: [policyFieldSchema],
        targetAudience: { type: String, required: true },
        expiryDate: { type: Date, default: undefined },
        validityPeriod: {
            start: { type: Date, default: undefined },
            end: { type: Date, default: undefined },
        },
        created_by: {
            type: Schema.Types.ObjectId,
            // ref: 'User',
            required: true,
        },
    },

    { timestamps: true }
);

const Policy = model<IPolicy>('Policy', policySchema);

export default Policy;

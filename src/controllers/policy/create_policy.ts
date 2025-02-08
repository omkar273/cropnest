import { asyncHandler, ApiResponse, ApiError } from '../../utils/index.js';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Policy from '../../models/policy/policy.model.js';

// Validation rules
const validateCreatePolicy = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('requirements')
        .isArray({ min: 1 })
        .withMessage('At least one requirement is required'),
    body('requirements.*.key')
        .notEmpty()
        .withMessage('Requirement key is required'),
    body('requirements.*.name')
        .notEmpty()
        .withMessage('Requirement name is required'),
    body('requirements.*.type')
        .isIn([
            'text',
            'date',
            'number',
            'document',
            'boolean',
            'select',
            'multiselect',
        ])
        .withMessage('Invalid requirement type'),
    body('requirements.*.required')
        .isBoolean()
        .withMessage('Requirement required field must be a boolean'),
    body('targetAudience')
        .notEmpty()
        .withMessage('Target audience is required'),
];

const createPolicy = asyncHandler(async (req: Request, res: Response) => {
    const {
        title,
        description,
        requirements,
        targetAudience,
        expiryDate,
        validityPeriod,
        rules,
    } = req.body;

    const created_by = req.user?._id;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400, errors.array());
    }

    const policy = new Policy({
        title,
        description,
        requirements,
        targetAudience,
        expiryDate,
        validityPeriod,
        rules,
        created_by,
    });

    await policy.save();

    res.status(201).json(
        new ApiResponse(policy, 'Policy created successfully', 201)
    );
});

export { createPolicy, validateCreatePolicy };

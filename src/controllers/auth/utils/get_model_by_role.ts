import { ApiError } from './../../../utils/index.js';
import { UserRoles } from './../../../core/constants/enums/user_roles.js';
import { Agent } from '../../../models/index.js';

// Modified function to compare roles case-insensitively
const getModelByRole = (role: string) => {
    const normalizedRole = role.toLowerCase().trim();
    console.log('Role received:', role.length, role);
    console.log('Normalized role:', normalizedRole.length, normalizedRole);

    switch (normalizedRole) {
        case UserRoles.CUSTOMER.toLowerCase():
            throw new Error('Customer model not implemented');
            return '';
        case UserRoles.AGENT.toLowerCase():
            return Agent;
        default:
            throw new ApiError('Invalid role in req');
    }
};

export default getModelByRole;

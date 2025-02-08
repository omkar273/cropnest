import { Router } from 'express';
import { createPolicy, validateCreatePolicy } from '../../controllers/index.js';

const policyRouter = Router();

policyRouter.post('/', validateCreatePolicy, createPolicy);

export { policyRouter };

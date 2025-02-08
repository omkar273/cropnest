import { Router } from 'express';
import {
    getUser,
    loginAgent,
    loginUser,
    logoutUser,
    registerAgent,
    registerAgentValidation,
    sendOtp,
} from '../../controllers/index.js';
import { upload, verifyJwt } from '../../middlewares/index.js';

const authRouter = Router();

authRouter.route('/login').post(loginUser);

authRouter.route('/login-agent').post(loginAgent);

authRouter.route('/logout').post(verifyJwt, logoutUser);

authRouter
    .route('/register-agent')
    .post(upload.single('adhaar_file'), registerAgentValidation, registerAgent);

authRouter.route('/send-otp').post(sendOtp);

authRouter.route('/me').get(verifyJwt, getUser);

export { authRouter };

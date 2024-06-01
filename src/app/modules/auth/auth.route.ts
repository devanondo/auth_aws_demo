import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthZodValidation } from './autn.validation';
import validateData from '../../../middleware/validate-request';
import { auth } from '../../../middleware/auth';

const router = Router();

router
    .route('/')
    .post(
        validateData(AuthZodValidation.loginZodSchema),
        AuthController.loginUser
    );

//Send otp
router.route('/send-otp').post(AuthController.sendOtp);
router.route('/change-password').post(AuthController.changePassword);
router.route('/verify-user').post(AuthController.verifyUser);

// Get login user information
router.route('/me').get(auth(), AuthController.getLoggedInUser);

export const AuthRoutes = router;

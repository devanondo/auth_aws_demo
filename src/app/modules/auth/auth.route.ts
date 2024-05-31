import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthZodValidation } from './autn.validation';
import validateData from '../../../middleware/validate-request';

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

export const AuthRoutes = router;

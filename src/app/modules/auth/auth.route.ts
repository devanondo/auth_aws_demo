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

export const AuthRoutes = router;

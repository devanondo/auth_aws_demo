import { Router } from 'express';
import { auth } from '../../../middleware/auth';
import validateData from '../../../middleware/validate-request';
import { UserController } from './user.controller';
import { UserZodValidation } from './user.validation';

const router = Router();

// Action --> User Profile
// router.route('/me')

// Action in the root route --> /
router.route('/').get(auth(), UserController.getUsers);

// Register Admin
router
    .route('/admin')
    .post(
        auth('superadmin'),
        validateData(UserZodValidation.createAdminZodSchema),
        UserController.createAdmin
    );

// Action with single --> id
router
    .route('/:id')
    .get(auth(), UserController.getSingleUsers)
    .patch(
        auth('superadmin'),
        validateData(UserZodValidation.updateUserZodSchema),
        UserController.updateUser
    )
    //Delete User not removed from database
    .put(auth('superadmin'), UserController.deleteUser)
    // Removed user from database
    .delete(auth('superadmin'), UserController.trushUser);

export const UserRoutes = router;

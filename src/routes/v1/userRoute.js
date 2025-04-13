import express from 'express';
import userController from '~/controllers/userController';
import userValidation from '~/validations/userValidation';

const router = express.Router();

router.route('/register')
    .post(userValidation.register, userController.register);

router.route('/verify')
    .put(userValidation.verifyUser, userController.verifyUser);

router.route('/login')
    .post(userValidation.login, userController.login);

router.route('/logout')
    .delete(userController.logout);

router.route('/refresh-token')
    .get(userController.refreshToken);

export default router;
import express from 'express';
import AuthController from '../controllers/Auth.controller';

const router = express.Router();

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

router.delete('/logout', AuthController.logout);

export default router;

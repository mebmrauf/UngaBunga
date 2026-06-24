import express from 'express';
import {loginUser, registerUser, adminLogin} from '../controllers/userController.js';
import { validateRequest, registerSchema, loginSchema } from '../middleware/validator.js';

const userRouter = express.Router();

userRouter.post('/register', validateRequest(registerSchema), registerUser);
userRouter.post('/login', validateRequest(loginSchema), loginUser);
userRouter.post('/admin', validateRequest(loginSchema), adminLogin);

export default userRouter;
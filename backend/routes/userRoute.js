import express from 'express';
import {loginUser, registerUser, adminLogin} from '../controllers/userController.js';
import { validateRequest, registerSchema, loginSchema } from '../middleware/validator.js';

const userRouter = express.Router();

// Simple info / health endpoint for the user routes
userRouter.get('/', (req, res) => {
	res.json({
		message: 'User routes available',
		routes: ['/register (POST)', '/login (POST)', '/admin (POST)']
	});
});

userRouter.post('/register', validateRequest(registerSchema), registerUser);
userRouter.post('/login', validateRequest(loginSchema), loginUser);
userRouter.post('/admin', validateRequest(loginSchema), adminLogin);

export default userRouter;
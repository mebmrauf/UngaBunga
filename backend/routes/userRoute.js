import express from 'express';
import {loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, getNotifications, markNotificationsRead} from '../controllers/userController.js';
import { validateRequest, registerSchema, loginSchema } from '../middleware/validator.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

// Simple info / health endpoint for the user routes
userRouter.get('/', (req, res) => {
	res.json({
		message: 'User routes available',
		routes: ['/register (POST)', '/login (POST)', '/admin (POST)', '/profile (GET/PUT)', '/notifications (GET/PUT)']
	});
});

userRouter.post('/register', validateRequest(registerSchema), registerUser);
userRouter.post('/login', validateRequest(loginSchema), loginUser);
userRouter.post('/admin', validateRequest(loginSchema), adminLogin);

userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);

userRouter.get('/notifications', authUser, getNotifications);
userRouter.put('/notifications/read', authUser, markNotificationsRead);

export default userRouter;
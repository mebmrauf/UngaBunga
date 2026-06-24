import express from 'express';
import { dashboardStats } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard', adminAuth, dashboardStats);

export default adminRouter;

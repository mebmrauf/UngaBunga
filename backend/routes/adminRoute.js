import express from 'express';
import { dashboardStats, getUsers, updateUserRole, getAllRecipes, updateRecipeStatus } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard', adminAuth, dashboardStats);
adminRouter.get('/users', adminAuth, getUsers);
adminRouter.put('/user/role', adminAuth, updateUserRole);
adminRouter.get('/recipes', adminAuth, getAllRecipes);
adminRouter.put('/recipe/status', adminAuth, updateRecipeStatus);

export default adminRouter;

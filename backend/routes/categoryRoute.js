import express from 'express';
import { listCategories, addCategory, updateCategory, removeCategory } from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';
import { validateRequest, categorySchema } from '../middleware/validator.js';

const categoryRouter = express.Router();

categoryRouter.get('/list', listCategories);
categoryRouter.post('/add', adminAuth, validateRequest(categorySchema), addCategory);
categoryRouter.post('/update', adminAuth, validateRequest(categorySchema), updateCategory);
categoryRouter.post('/remove', adminAuth, removeCategory);

export default categoryRouter;

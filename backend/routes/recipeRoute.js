import express from 'express';
import { uploadRecipe, getFeed, getRecipeById } from '../controllers/recipeController.js';
import authUser from '../middleware/auth.js';

const recipeRouter = express.Router();

recipeRouter.post('/upload', authUser, uploadRecipe);
recipeRouter.get('/feed', getFeed);
recipeRouter.get('/:id', getRecipeById);

export default recipeRouter;

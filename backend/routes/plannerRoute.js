import express from 'express';
import { createPlan, getPlan } from '../controllers/plannerController.js';
import authUser from '../middleware/auth.js';

const plannerRouter = express.Router();

plannerRouter.post('/create', authUser, createPlan);
plannerRouter.get('/my-plan', authUser, getPlan);

export default plannerRouter;

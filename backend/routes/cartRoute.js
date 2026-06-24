import express from 'express';
import { generateCart, updateCart, getCart } from '../controllers/cartController.js';
import authUser from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/generate', authUser, generateCart);
cartRouter.put('/update', authUser, updateCart);
cartRouter.get('/my-cart', authUser, getCart);

export default cartRouter;

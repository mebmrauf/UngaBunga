import express from 'express';
import { setupStore, updateInventory, getOrders, getStore } from '../controllers/shopkeeperController.js';
import authUser from '../middleware/auth.js';

const shopkeeperRouter = express.Router();

shopkeeperRouter.post('/setup', authUser, setupStore);
shopkeeperRouter.get('/store', authUser, getStore);
shopkeeperRouter.put('/inventory', authUser, updateInventory);
shopkeeperRouter.get('/orders', authUser, getOrders);

export default shopkeeperRouter;

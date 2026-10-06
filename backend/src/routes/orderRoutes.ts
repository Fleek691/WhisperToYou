import { Router } from 'express';
import { createOrder, getOrderById } from '../controllers/orderController.js';

const router = Router();

router.post('/create', createOrder);
router.get('/:id', getOrderById);

export default router;

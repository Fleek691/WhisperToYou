import { Router } from 'express';
import { createPaymentOrder, verifyPayment, cashfreeWebhook } from '../controllers/paymentController.js';

const router = Router();

router.post('/create', createPaymentOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', cashfreeWebhook);

export default router;

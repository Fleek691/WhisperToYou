import { Router } from 'express';
import {
  adminLogin,
  getAdminOrders,
  updateOrderStatus,
  getAdminReviews,
  updateReviewStatus,
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', adminLogin);

// Protected Admin Routes
router.get('/orders', authenticateAdmin, getAdminOrders);
router.patch('/orders/:id/status', authenticateAdmin, updateOrderStatus);
router.get('/reviews', authenticateAdmin, getAdminReviews);
router.patch('/reviews/:id', authenticateAdmin, updateReviewStatus);

export default router;

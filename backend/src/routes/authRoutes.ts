import express from 'express';
import { googleLogin, getMe } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/google', googleLogin);
router.get('/me', authenticateUser, getMe);

export default router;

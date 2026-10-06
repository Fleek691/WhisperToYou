import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OrderModel } from '../models/Order.js';
import { ReviewModel } from '../models/Review.js';
import { inMemoryDB } from '../config/db.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import { sendOrderConfirmationSMS } from '../services/smsService.js';

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!password || password !== expectedPassword) {
      res.status(401).json({ message: 'Invalid admin credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'whisper_to_you_super_secret_jwt';
    const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '7d' });

    res.json({ token, message: 'Admin authenticated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

export const getAdminOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    let orders = [];
    try {
      orders = await OrderModel.find().sort({ createdAt: -1 });
    } catch (e) {}

    if (orders.length === 0 && inMemoryDB.orders.length > 0) {
      orders = [...inMemoryDB.orders].reverse();
    }

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, shippingCarrier, trackingNumber, trackingUrl } = req.body;

    const updateFields: any = { updatedAt: new Date() };
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (shippingCarrier) updateFields.shippingCarrier = shippingCarrier;
    if (trackingNumber) updateFields.trackingNumber = trackingNumber;
    if (trackingUrl) updateFields.trackingUrl = trackingUrl;

    let updatedOrder = null;
    try {
      updatedOrder = await OrderModel.findOneAndUpdate({ orderId: id }, updateFields, { new: true });
    } catch (e) {}

    if (!updatedOrder) {
      const idx = inMemoryDB.orders.findIndex((o) => o.orderId === id);
      if (idx !== -1) {
        Object.assign(inMemoryDB.orders[idx], updateFields);
        updatedOrder = inMemoryDB.orders[idx];
      }
    }

    if (!updatedOrder) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // If payment status was updated to successful, send confirmations
    if (paymentStatus === 'successful') {
      sendOrderConfirmationEmail({
        to: updatedOrder.email,
        customerName: updatedOrder.customerName,
        orderId: updatedOrder.orderId,
        quantity: updatedOrder.quantity,
        bookPrice: updatedOrder.bookPrice,
        shippingCharge: updatedOrder.shippingCharge,
        totalAmount: updatedOrder.totalAmount,
        address: updatedOrder.address,
        city: updatedOrder.city,
        state: updatedOrder.state,
        pincode: updatedOrder.pincode,
      }).catch(console.error);

      sendOrderConfirmationSMS({
        phone: updatedOrder.phone,
        orderId: updatedOrder.orderId,
        customerName: updatedOrder.customerName,
        totalAmount: updatedOrder.totalAmount,
      }).catch(console.error);
    }

    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

export const getAdminReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    let reviews = [];
    try {
      reviews = await ReviewModel.find().sort({ createdAt: -1 });
    } catch (e) {}

    if (reviews.length === 0 && inMemoryDB.reviews.length > 0) {
      reviews = [...inMemoryDB.reviews].reverse();
    }

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

export const updateReviewStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    let updatedReview = null;
    try {
      updatedReview = await ReviewModel.findByIdAndUpdate(id, { status }, { new: true });
    } catch (e) {}

    if (!updatedReview) {
      const rev = inMemoryDB.reviews.find((r) => r._id === id || r.id === id);
      if (rev) {
        rev.status = status;
        updatedReview = rev;
      }
    }

    if (!updatedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    res.json(updatedReview);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

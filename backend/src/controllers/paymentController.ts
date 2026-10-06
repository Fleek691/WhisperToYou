import { Request, Response } from 'express';
import crypto from 'crypto';
import { getRazorpayInstance } from '../config/razorpay.js';
import { OrderModel } from '../models/Order.js';
import { inMemoryDB } from '../config/db.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import { sendOrderConfirmationSMS } from '../services/smsService.js';

export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400).json({ message: 'orderId is required' });
      return;
    }

    let order: any = null;
    try {
      order = await OrderModel.findOne({ orderId });
    } catch (e) {}

    if (!order) {
      order = inMemoryDB.orders.find((o) => o.orderId === orderId);
    }

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const rzp = getRazorpayInstance();

    // Development / Test Mode Fallback
    if (!rzp) {
      console.warn('⚠️  Razorpay credentials not found in env. Returning test payment payload.');
      const testOrderId = `order_test_${Date.now()}`;
      order.razorpayOrderId = testOrderId;
      res.json({
        keyId: 'rzp_test_placeholder',
        razorpayOrderId: testOrderId,
        amount: order.totalAmount * 100,
        currency: 'INR',
        isTestMode: true,
      });
      return;
    }

    // Live Razorpay Order Creation
    const options = {
      amount: order.totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: order.orderId,
      payment_capture: 1,
    };

    const rzpOrder = await rzp.orders.create(options);

    // Save razorpayOrderId back to order
    try {
      await OrderModel.findOneAndUpdate({ orderId }, { razorpayOrderId: rzpOrder.id });
    } catch (e) {
      order.razorpayOrderId = rzpOrder.id;
    }

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      isTestMode: false,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, isTestMode } = req.body;

    if (!orderId || !razorpayPaymentId) {
      res.status(400).json({ message: 'Missing required payment verification fields' });
      return;
    }

    let order: any = null;
    try {
      order = await OrderModel.findOne({ orderId });
    } catch (e) {}

    if (!order) {
      order = inMemoryDB.orders.find((o) => o.orderId === orderId);
    }

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Signature Verification Logic
    let isValid = false;

    if (isTestMode || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('YOUR_KEY_SECRET')) {
      console.warn('⚠️  Verifying in Test Mode execution');
      isValid = true;
    } else {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isValid = expectedSignature === razorpaySignature;
    }

    if (!isValid) {
      // Mark failed
      try {
        await OrderModel.findOneAndUpdate({ orderId }, { paymentStatus: 'failed' });
      } catch (e) {
        order.paymentStatus = 'failed';
      }
      res.status(400).json({ success: false, message: 'Invalid payment signature verification' });
      return;
    }

    // Update order to successful payment & processing status
    const updateData = {
      paymentStatus: 'successful',
      orderStatus: 'Processing',
      razorpayPaymentId,
      razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
      updatedAt: new Date(),
    };

    try {
      order = await OrderModel.findOneAndUpdate({ orderId }, updateData, { new: true });
    } catch (e) {
      Object.assign(order, updateData);
    }

    // Trigger transactional email confirmation
    sendOrderConfirmationEmail({
      to: order.email,
      customerName: order.customerName,
      orderId: order.orderId,
      quantity: order.quantity,
      bookPrice: order.bookPrice,
      shippingCharge: order.shippingCharge,
      totalAmount: order.totalAmount,
      address: order.address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
    }).catch(console.error);

    // Trigger SMS notification module
    sendOrderConfirmationSMS({
      phone: order.phone,
      orderId: order.orderId,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
    }).catch(console.error);

    res.json({
      success: true,
      message: 'Payment verified and order confirmed',
      order,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};

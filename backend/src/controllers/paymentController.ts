import { Request, Response } from 'express';
import { Cashfree } from 'cashfree-pg';
import { initializeCashfree } from '../config/cashfree.js';
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

    const isInitialized = initializeCashfree();

    // Development / Test Mode Fallback
    if (!isInitialized) {
      console.warn('⚠️  Cashfree credentials not found in env. Returning test payment payload.');
      const testSessionId = `session_test_${Date.now()}`;
      res.json({
        payment_session_id: testSessionId,
        order_id: orderId,
        isTestMode: true,
      });
      return;
    }

    // Live Cashfree Order Creation
    const request = {
      order_amount: order.totalAmount,
      order_currency: 'INR',
      order_id: order.orderId,
      customer_details: {
        customer_id: order.email ? order.email.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50) : 'cust_123',
        customer_name: order.customerName,
        customer_email: order.email || 'customer@example.com',
        customer_phone: order.phone || '9999999999'
      }
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);

    res.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
      isTestMode: false,
    });
  } catch (error: any) {
    console.error('Error creating Cashfree order:', error?.response?.data || error);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, isTestMode } = req.body;

    if (!orderId) {
      res.status(400).json({ message: 'Missing orderId' });
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

    let isValid = false;
    let paymentId = 'test_payment_id';

    const isInitialized = initializeCashfree();

    if (isTestMode || !isInitialized) {
      console.warn('⚠️  Verifying in Test Mode execution');
      isValid = true;
    } else {
      try {
        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        const payments = response.data;
        // Find if any payment was successful
        const successfulPayment = payments.find((p: any) => p.payment_status === 'SUCCESS');
        
        if (successfulPayment) {
          isValid = true;
          paymentId = successfulPayment.cf_payment_id?.toString() || 'cf_payment';
        }
      } catch (err) {
        console.error('Error fetching Cashfree payments:', err);
      }
    }

    if (!isValid) {
      // Mark failed
      try {
        await OrderModel.findOneAndUpdate({ orderId }, { paymentStatus: 'failed' });
      } catch (e) {
        order.paymentStatus = 'failed';
      }
      res.status(400).json({ success: false, message: 'Payment not successful' });
      return;
    }

    // Update order to successful payment & processing status
    const updateData = {
      paymentStatus: 'successful',
      orderStatus: 'Processing',
      paymentId: paymentId,
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

/**
 * Cashfree Webhook Handler
 * Ensures that if a user closes the browser before redirection, 
 * the order still gets marked as successful in the background.
 */
export const cashfreeWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = req.body?.type;

    // Return early if not a payment success webhook (this handles Cashfree's 'Test' pings)
    if (type !== 'PAYMENT_SUCCESS_WEBHOOK') {
      res.status(200).send('Ignored event type');
      return;
    }

    const orderId = req.body?.data?.order?.order_id;

    if (!orderId) {
      res.status(400).send('No order ID found in webhook payload');
      return;
    }

    const isInitialized = initializeCashfree();
    if (!isInitialized) {
      res.status(200).send('Test mode, webhook ignored');
      return;
    }

    // Secure Verification: Always ask Cashfree directly for the status
    // This prevents malicious actors from spoofing a success webhook
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    const payments = response.data;
    const successfulPayment = payments.find((p: any) => p.payment_status === 'SUCCESS');

    if (successfulPayment) {
      const paymentId = successfulPayment.cf_payment_id?.toString() || 'cf_payment';

      // Check if order is already processed
      const order = await OrderModel.findOne({ orderId });
      
      if (order && order.paymentStatus !== 'successful') {
        const updatedOrder = await OrderModel.findOneAndUpdate(
          { orderId },
          {
            paymentStatus: 'successful',
            orderStatus: 'Processing',
            paymentId: paymentId,
            updatedAt: new Date(),
          },
          { new: true }
        );

        // Send notifications
        if (updatedOrder && updatedOrder.email) {
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
        }
        if (updatedOrder && updatedOrder.phone) {
          sendOrderConfirmationSMS({
            phone: updatedOrder.phone,
            orderId: updatedOrder.orderId,
            customerName: updatedOrder.customerName,
            totalAmount: updatedOrder.totalAmount,
          }).catch(console.error);
        }
      }
    }
    
    // Always return 200 OK to Cashfree so they stop retrying
    res.status(200).send('Webhook Processed');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
};


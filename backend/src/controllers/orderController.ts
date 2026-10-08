import { Request, Response } from 'express';
import { OrderModel, IOrder } from '../models/Order.js';
import { inMemoryDB } from '../config/db.js';

// Central configuration values on server
const BOOK_PRICE = 279; // ₹ INR
const LOCAL_SHIPPING_CHARGE = 80; // ₹ INR (West Bengal)
const NATIONAL_SHIPPING_CHARGE = 100; // ₹ INR (Other States)
const FREE_SHIPPING_THRESHOLD = 999; // ₹ INR

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, address, city, state, pincode, quantity, utrNumber } = req.body;

    // Server-side Input Validation
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      res.status(400).json({ message: 'All customer address fields are required' });
      return;
    }

    const qty = Math.max(1, parseInt(quantity) || 1);

    // SERVER-SIDE PRICE & SHIPPING CALCULATION (CRITICAL SECURITY)
    const subtotal = BOOK_PRICE * qty;
    
    let shippingCharge = 0;
    if (subtotal < FREE_SHIPPING_THRESHOLD) {
      const stateStr = state.trim().toLowerCase();
      const isWestBengal = stateStr === 'wb' || stateStr.includes('west bengal') || stateStr === 'w.b' || stateStr === 'w.b.';
      shippingCharge = isWestBengal ? LOCAL_SHIPPING_CHARGE : NATIONAL_SHIPPING_CHARGE;
    }
    
    const totalAmount = subtotal + shippingCharge;

    const orderId = `WTY-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const orderData = {
      orderId,
      customerName: fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      quantity: qty,
      bookPrice: BOOK_PRICE,
      subtotal,
      shippingCharge,
      totalAmount,
      utrNumber,
      paymentStatus: utrNumber ? 'pending_verification' : 'pending',
      orderStatus: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB if available, else store in inMemoryDB
    try {
      const orderDoc = new OrderModel(orderData);
      await orderDoc.save();
    } catch (e) {
      inMemoryDB.orders.push(orderData);
    }

    res.status(201).json(orderData);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let order = null;
    try {
      order = await OrderModel.findOne({ orderId: id });
    } catch (e) {}

    if (!order) {
      order = inMemoryDB.orders.find((o) => o.orderId === id);
    }

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

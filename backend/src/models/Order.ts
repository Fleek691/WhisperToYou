import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  quantity: number;
  bookPrice: number;
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  utrNumber?: string;
  paymentStatus: 'pending' | 'pending_verification' | 'successful' | 'failed' | 'cancelled';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentSessionId?: string;
  paymentId?: string;
  shippingCarrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    bookPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'pending_verification', 'successful', 'failed', 'cancelled'],
      default: 'pending',
    },
    utrNumber: { type: String },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentSessionId: { type: String },
    paymentId: { type: String },
    shippingCarrier: { type: String },
    trackingNumber: { type: String },
    trackingUrl: { type: String },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

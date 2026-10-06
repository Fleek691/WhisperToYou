export interface OrderItem {
  bookTitle: string;
  author: string;
  quantity: number;
  bookPrice: number;
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  utrNumber?: string;
}

export interface OrderData extends CustomerDetails {
  orderId?: string;
  _id?: string;
  quantity: number;
  bookPrice: number;
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'pending_verification' | 'successful' | 'failed' | 'cancelled';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingCarrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewItem {
  _id?: string;
  id?: string;
  customerName: string;
  email?: string;
  rating: number;
  review: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface ContactMessageItem {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

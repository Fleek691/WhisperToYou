import { CustomerDetails, OrderData, ReviewItem, ContactMessageItem } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Order APIs
  async createOrder(data: CustomerDetails & { quantity: number }): Promise<OrderData> {
    const res = await fetch(`${API_BASE}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create order');
    }
    return res.json();
  },

  async getOrder(orderId: string): Promise<OrderData> {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  // Payment APIs
  async createRazorpayOrder(orderId: string): Promise<{ razorpayOrderId: string; amount: number; currency: string; keyId: string; isTestMode?: boolean }> {
    const res = await fetch(`${API_BASE}/payment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Payment initiation failed');
    }
    return res.json();
  },

  async verifyPayment(payload: {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
    isTestMode?: boolean;
  }): Promise<{ success: boolean; order: OrderData }> {
    const res = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Payment verification failed');
    }
    return res.json();
  },

  // Review APIs
  async getApprovedReviews(): Promise<ReviewItem[]> {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) return [];
    return res.json();
  },

  async submitReview(review: { customerName: string; email: string; rating: number; review: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit review');
    }
    return res.json();
  },

  // Contact API
  async submitContact(contact: { name: string; email: string; message: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to send message');
    }
    return res.json();
  },

  // Admin APIs
  async adminLogin(password: string): Promise<{ token: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Invalid admin credentials');
    }
    return res.json();
  },

  async getAdminOrders(token: string): Promise<OrderData[]> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async updateOrderStatus(
    token: string,
    orderId: string,
    updates: { orderStatus?: string; paymentStatus?: string; shippingCarrier?: string; trackingNumber?: string; trackingUrl?: string }
  ): Promise<OrderData> {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async getAdminReviews(token: string): Promise<ReviewItem[]> {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async updateReviewStatus(token: string, reviewId: string, status: 'approved' | 'rejected'): Promise<ReviewItem> {
    const res = await fetch(`${API_BASE}/admin/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update review status');
    return res.json();
  }
};

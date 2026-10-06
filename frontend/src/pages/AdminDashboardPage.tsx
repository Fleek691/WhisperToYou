import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { OrderData, ReviewItem } from '../types';
import { Lock, LogOut, Package, CheckCircle, Clock, Truck, DollarSign, AlertCircle, RefreshCw, X, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardPageProps {
  onClose: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onClose }) => {
  const { token, user } = useAuth();

  // Data state
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);

  // Tracking edit modal
  const [editingTracking, setEditingTracking] = useState<OrderData | null>(null);
  const [carrier, setCarrier] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  useEffect(() => {
    if (token && user?.role === 'admin') {
      loadAdminData();
    }
  }, [token, user]);

  const handleLogout = () => {
    onClose();
  };

  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [orderList, reviewList] = await Promise.all([
        api.getAdminOrders(token),
        api.getAdminReviews(token),
      ]);
      setOrders(orderList);
      setReviews(reviewList);
    } catch (err) {
      console.error(err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newOrderStatus: string) => {
    if (!token) return;
    try {
      const updated = await api.updateOrderStatus(token, orderId, { orderStatus: newOrderStatus });
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      if (selectedOrder?.orderId === orderId) setSelectedOrder(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handlePaymentApprove = async (orderId: string) => {
    if (!token) return;
    try {
      const updated = await api.updateOrderStatus(token, orderId, { 
        paymentStatus: 'successful', 
        orderStatus: 'Processing' 
      });
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      if (selectedOrder?.orderId === orderId) setSelectedOrder(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to approve payment');
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingTracking) return;
    try {
      const updated = await api.updateOrderStatus(token, editingTracking.orderId!, {
        orderStatus: 'Shipped',
        shippingCarrier: carrier,
        trackingNumber: trackingNo,
        trackingUrl: trackingUrl,
      });
      setOrders((prev) => prev.map((o) => (o.orderId === editingTracking.orderId ? updated : o)));
      setEditingTracking(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update tracking info');
    }
  };

  const handleReviewAction = async (reviewId: string, status: 'approved' | 'rejected') => {
    if (!token) return;
    try {
      const updated = await api.updateReviewStatus(token, reviewId, status);
      setReviews((prev) => prev.map((r) => (r._id === reviewId || r.id === reviewId ? updated : r)));
    } catch (err: any) {
      alert(err.message || 'Failed to update review status');
    }
  };

  // Metrics calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const processingOrders = orders.filter((o) => o.orderStatus === 'Processing').length;
  const shippedOrders = orders.filter((o) => o.orderStatus === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'successful')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // If not logged in as admin, don't render anything
  if (!token || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-neutral-200 overflow-y-auto p-4 sm:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
          <div>
            <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold">
              Author Management Console
            </span>
            <h1 className="font-serif text-3xl font-light text-white">
              ADMIN DASHBOARD
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAdminData}
              className="px-4 py-2 bg-[#121212] hover:bg-neutral-800 border border-neutral-800 text-xs tracking-wider uppercase font-sans text-neutral-300 rounded-sm flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs tracking-wider uppercase font-sans text-white rounded-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#0D0D0D] p-5 border border-neutral-800 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">Total Orders</span>
            <p className="font-serif text-3xl text-white font-bold">{totalOrders}</p>
          </div>

          <div className="bg-[#0D0D0D] p-5 border border-amber-900/40 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-sans">Pending</span>
            <p className="font-serif text-3xl text-amber-400 font-bold">{pendingOrders}</p>
          </div>

          <div className="bg-[#0D0D0D] p-5 border border-blue-900/40 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-sans">Processing</span>
            <p className="font-serif text-3xl text-blue-400 font-bold">{processingOrders}</p>
          </div>

          <div className="bg-[#0D0D0D] p-5 border border-purple-900/40 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-purple-400 font-sans">Shipped</span>
            <p className="font-serif text-3xl text-purple-400 font-bold">{shippedOrders}</p>
          </div>

          <div className="bg-[#0D0D0D] p-5 border border-emerald-900/40 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-sans">Delivered</span>
            <p className="font-serif text-3xl text-emerald-400 font-bold">{deliveredOrders}</p>
          </div>

          <div className="bg-[#0D0D0D] p-5 border border-crimson-900/60 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-crimson-400 font-sans">Revenue</span>
            <p className="font-serif text-2xl text-crimson-400 font-bold">₹{totalRevenue}</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-800 space-x-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs tracking-widest uppercase font-sans border-b-2 font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'border-crimson-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Orders Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 text-xs tracking-widest uppercase font-sans border-b-2 font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'border-crimson-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Reviews Moderation ({reviews.filter((r) => r.status === 'pending').length} Pending)
          </button>
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-[#0D0D0D] border border-neutral-800 rounded-sm overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-[#121212] uppercase tracking-widest text-[10px] text-neutral-400 border-b border-neutral-800">
                  <tr>
                    <th className="py-4 px-4">Order ID</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Phone / Email</th>
                    <th className="py-4 px-4">Qty</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Payment</th>
                    <th className="py-4 px-4">Order Status</th>
                    <th className="py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {orders.map((ord) => (
                    <tr key={ord.orderId} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-4 px-4 font-mono text-crimson-400 font-semibold">{ord.orderId}</td>
                      <td className="py-4 px-4 font-medium text-white">{ord.fullName}</td>
                      <td className="py-4 px-4 text-neutral-400">
                        <div>{ord.phone}</div>
                        <div className="text-[10px]">{ord.email}</div>
                      </td>
                      <td className="py-4 px-4 text-white font-medium">{ord.quantity}</td>
                      <td className="py-4 px-4 text-white font-semibold">₹{ord.totalAmount}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`w-max px-2 py-0.5 text-[10px] font-semibold uppercase rounded-sm border ${
                            ord.paymentStatus === 'successful'
                              ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                              : 'bg-amber-950/60 border-amber-700 text-amber-300'
                          }`}>
                            {ord.paymentStatus.replace('_', ' ')}
                          </span>
                          {ord.utrNumber && (
                            <span className="text-[9px] text-neutral-400 font-mono">UTR: {ord.utrNumber}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleStatusChange(ord.orderId!, e.target.value)}
                          className="bg-[#181818] border border-neutral-700 text-white text-xs px-2 py-1 rounded-sm focus:outline-none focus:border-crimson-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 space-x-2">
                        {ord.paymentStatus === 'pending_verification' && (
                          <button
                            onClick={() => handlePaymentApprove(ord.orderId!)}
                            className="p-1.5 bg-emerald-900 hover:bg-emerald-700 text-emerald-100 rounded-sm border border-emerald-700 mb-1 inline-flex items-center"
                            title="Approve Payment"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 bg-[#181818] hover:bg-neutral-800 text-neutral-300 rounded-sm border border-neutral-700 inline-flex items-center mb-1"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTracking(ord);
                            setCarrier(ord.shippingCarrier || 'Delhivery / SpeedPost');
                            setTrackingNo(ord.trackingNumber || '');
                            setTrackingUrl(ord.trackingUrl || '');
                          }}
                          className="p-1.5 bg-crimson-950 hover:bg-crimson-800 text-crimson-300 rounded-sm border border-crimson-700 text-[10px] uppercase tracking-wider font-semibold"
                        >
                          Ship
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-[#0D0D0D] border border-neutral-800 rounded-sm p-6 space-y-6">
            <h3 className="font-serif text-xl text-white">Submitted Customer Reviews</h3>
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id || rev.id}
                  className="bg-[#121212] p-5 border border-neutral-800 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base text-white font-medium">{rev.customerName}</span>
                      <span className="text-xs text-crimson-400">{'★'.repeat(rev.rating)}</span>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm border ${
                        rev.status === 'approved' ? 'bg-emerald-950 border-emerald-700 text-emerald-300' :
                        rev.status === 'rejected' ? 'bg-red-950 border-red-700 text-red-300' :
                        'bg-amber-950 border-amber-700 text-amber-300'
                      }`}>
                        {rev.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 italic">"{rev.review}"</p>
                    <p className="text-[10px] text-neutral-400">Email: {rev.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleReviewAction((rev._id || rev.id)!, 'approved')}
                        className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-700 text-white text-xs font-semibold rounded-sm uppercase tracking-wider"
                      >
                        Approve
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleReviewAction((rev._id || rev.id)!, 'rejected')}
                        className="px-3 py-1.5 bg-crimson-900 hover:bg-crimson-700 text-white text-xs font-semibold rounded-sm uppercase tracking-wider"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-2xl w-full bg-[#0D0D0D] border border-crimson-900 p-8 rounded-sm space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="font-serif text-2xl text-white">Order Details: {selectedOrder.orderId}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-300">
              <div>
                <span className="text-neutral-400 uppercase tracking-widest block">Customer Name</span>
                <span className="text-white text-sm">{selectedOrder.fullName}</span>
              </div>
              <div>
                <span className="text-neutral-400 uppercase tracking-widest block">Phone</span>
                <span className="text-white text-sm">{selectedOrder.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-400 uppercase tracking-widest block">Address</span>
                <span className="text-white text-sm">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</span>
              </div>
              <div>
                <span className="text-neutral-400 uppercase tracking-widest block">Quantity</span>
                <span className="text-white text-sm">{selectedOrder.quantity}</span>
              </div>
              <div>
                <span className="text-neutral-400 uppercase tracking-widest block">Total Amount</span>
                <span className="text-crimson-400 font-bold text-sm">₹{selectedOrder.totalAmount}</span>
              </div>
              <div>
                <span className="text-neutral-400 uppercase tracking-widest block">Razorpay Order ID</span>
                <span className="font-mono text-neutral-300">{selectedOrder.razorpayOrderId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-neutral-400 uppercase tracking-widest block">Payment UTR / Ref</span>
                <span className="font-mono text-neutral-300">{selectedOrder.utrNumber || selectedOrder.razorpayPaymentId || 'N/A'}</span>
              </div>
            </div>

            {selectedOrder.shippingCarrier && (
              <div className="bg-[#141414] p-4 rounded-sm border border-neutral-800 space-y-1 text-xs">
                <span className="text-crimson-400 font-semibold uppercase tracking-wider block">Shipping Tracking</span>
                <p>Carrier: {selectedOrder.shippingCarrier}</p>
                <p>Tracking #: {selectedOrder.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Tracking Modal */}
      {editingTracking && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-[#0D0D0D] border border-crimson-900 p-6 rounded-sm space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-serif text-xl text-white">Update Dispatch Details</h3>
              <button onClick={() => setEditingTracking(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-widest text-neutral-300 mb-1">Carrier Name</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. Delhivery / India Post"
                  className="w-full bg-[#141414] border border-neutral-800 px-3 py-2 text-white rounded-sm"
                />
              </div>

              <div>
                <label className="block uppercase tracking-widest text-neutral-300 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="Enter tracking AWB number"
                  className="w-full bg-[#141414] border border-neutral-800 px-3 py-2 text-white rounded-sm"
                />
              </div>

              <div>
                <label className="block uppercase tracking-widest text-neutral-300 mb-1">Tracking URL (Optional)</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://track.example.com/..."
                  className="w-full bg-[#141414] border border-neutral-800 px-3 py-2 text-white rounded-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-crimson-700 hover:bg-crimson-600 text-white font-semibold uppercase tracking-wider rounded-sm"
              >
                Mark as Shipped & Save
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

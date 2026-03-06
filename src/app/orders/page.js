'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ChevronDown, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import clsx from 'clsx';

const statusStyles = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const handleCancel = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(orderId);
    const { data, error } = await api.patch(`/api/orders/${orderId}/cancel`);
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
      );
    }
    setCancelling(null);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await api.get('/api/orders');
      if (data) {
        const payload = data.data || data;
        setOrders(Array.isArray(payload) ? payload : []);
      }
      setLoading(false);
    }
    if (user) fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-electric" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold text-white mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-lg font-medium text-gray-400">No orders yet</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">Your order history will appear here.</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2.5 bg-electric hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expanded === order.id;
            const style = statusStyles[order.status] || statusStyles.pending;
            const dateStr = order.created_at || order.createdAt;
            const date = dateStr
              ? new Date(dateStr).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })
              : '';
            const itemCount = order.items?.length || order.itemCount || 0;

            return (
              <div key={order.id} className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-sm font-medium text-white">
                        #{order.id?.substring(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{date}</p>
                    </div>
                    <span className={clsx('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize', style)}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        ${Number(order.total_amount || order.totalAmount || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={clsx('text-gray-500 transition-transform', isOpen && 'rotate-180')}
                    />
                  </div>
                </button>

                <div
                  className={clsx(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <div className="px-5 pb-5 border-t border-white/5">
                    <div className="space-y-3 pt-4">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-gray-300">{item.product_name || item.name || `Product ${(item.product_id || item.productId || '').substring(0, 8)}`}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-white font-medium">
                            ${(Number(item.unit_price || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    {order.status === 'pending' && (
                      <div className="pt-4 mt-4 border-t border-white/5">
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelling === order.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <XCircle size={14} />
                          )}
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

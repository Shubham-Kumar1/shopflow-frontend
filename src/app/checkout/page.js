'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import clsx from 'clsx';

const categoryGradients = {
  Electronics: 'from-blue-600 to-cyan-500',
  Clothing: 'from-pink-500 to-rose-400',
  Books: 'from-emerald-600 to-teal-400',
  'Home & Garden': 'from-amber-500 to-orange-400',
};

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }));
    }
  }, [user]);

  const shipping = total >= 100 ? 0 : 9.99;
  const orderTotal = total + shipping;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);

    const orderItems = items.map((item) => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
    }));

    const shippingAddress = {
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      country: form.country,
    };

    const { data: orderData, error: orderErr } = await api.post('/api/orders', {
      items: orderItems,
      shippingAddress,
    });

    if (orderErr) {
      setError(orderErr);
      setSubmitting(false);
      return;
    }

    const orderPayload = orderData?.data || orderData;
    const orderId = orderPayload?.id;
    if (orderId) {
      await api.post('/api/payments/initiate', {
        orderId,
        amount: orderTotal,
      });
    }

    clearCart();
    router.push('/orders');
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-electric" />
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 transition-colors';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {/* Shipping */}
          <div className="bg-gray-800/50 rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-display font-bold text-white mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required className={inputClass} placeholder="John" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required className={inputClass} placeholder="Doe" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Address</label>
                <input name="address" value={form.address} onChange={handleChange} required className={inputClass} placeholder="123 Main St" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">City</label>
                <input name="city" value={form.city} onChange={handleChange} required className={inputClass} placeholder="New York" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">State</label>
                <input name="state" value={form.state} onChange={handleChange} required className={inputClass} placeholder="NY" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">ZIP Code</label>
                <input name="zipCode" value={form.zipCode} onChange={handleChange} required className={inputClass} placeholder="10001" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Country</label>
                <input name="country" value={form.country} onChange={handleChange} required className={inputClass} placeholder="US" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gray-800/50 rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-display font-bold text-white mb-4">Payment Details</h2>
            <p className="text-xs text-gray-500 mb-4">Demo only — no real charges.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Card Number</label>
                <input name="cardNumber" value={form.cardNumber} onChange={handleChange} className={inputClass} placeholder="4242 4242 4242 4242" maxLength={19} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Expiry</label>
                  <input name="expiry" value={form.expiry} onChange={handleChange} className={inputClass} placeholder="MM/YY" maxLength={5} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">CVC</label>
                  <input name="cvc" value={form.cvc} onChange={handleChange} className={inputClass} placeholder="123" maxLength={4} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="bg-gray-800/50 rounded-xl border border-white/5 p-6 sticky top-24">
            <h2 className="text-lg font-display font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const gradient = categoryGradients[item.category] || 'from-gray-600 to-gray-500';
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={clsx('w-10 h-10 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center', gradient)}>
                      <span className="text-white/40 text-sm font-bold">{item.name?.[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 pt-4 border-t border-white/5 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="text-emerald-400 font-medium">FREE</span>
                ) : (
                  <span className="text-white">${shipping.toFixed(2)}</span>
                )}
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="text-lg font-bold text-white">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="w-full mt-6 py-3.5 bg-electric hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                `Place Order · $${orderTotal.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

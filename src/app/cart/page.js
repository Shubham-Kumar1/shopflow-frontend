'use client';

import Link from 'next/link';
import { Plus, Minus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';

const categoryGradients = {
  Electronics: 'from-blue-600 to-cyan-500',
  Clothing: 'from-pink-500 to-rose-400',
  Books: 'from-emerald-600 to-teal-400',
  'Home & Garden': 'from-amber-500 to-orange-400',
};

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const shipping = total >= 100 ? 0 : 9.99;
  const orderTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={56} className="mx-auto text-gray-600 mb-4" />
        <h1 className="text-2xl font-display font-bold text-white mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/products"
          className="inline-flex items-center px-8 py-3 bg-electric hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold text-white mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map((item) => {
            const gradient = categoryGradients[item.category] || 'from-gray-600 to-gray-500';
            return (
              <div key={item.id} className="flex items-center gap-4 bg-gray-800/50 rounded-xl border border-white/5 p-4">
                <div className={clsx('w-20 h-20 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center', gradient)}>
                  <span className="text-white/40 text-2xl font-display font-bold">{item.name?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">${Number(item.price).toFixed(2)} each</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-gray-800 rounded-lg border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-2 p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-gray-800/50 rounded-xl border border-white/5 p-6 sticky top-24">
            <h2 className="text-lg font-display font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
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
              <div className="pt-3 border-t border-white/5 flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="text-lg font-bold text-white">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full mt-6 py-3 bg-electric hover:bg-blue-600 text-white text-sm font-semibold text-center rounded-lg transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

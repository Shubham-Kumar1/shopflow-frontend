'use client';

import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import clsx from 'clsx';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, total } = useCart();

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <div
        className={clsx(
          'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-gray-900 border-l border-white/5 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-display font-bold text-white">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 font-medium">Your cart is empty</p>
            <p className="text-sm text-gray-500 mt-1">Add items to get started.</p>
            <Link
              href="/products"
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-electric hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="p-5 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-lg font-bold text-white">${total.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="text-center py-2.5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="text-center py-2.5 bg-electric hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

'use client';

import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';

const categoryGradients = {
  Electronics: 'from-blue-600 to-cyan-500',
  Clothing: 'from-pink-500 to-rose-400',
  Books: 'from-emerald-600 to-teal-400',
  'Home & Garden': 'from-amber-500 to-orange-400',
};

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const gradient = categoryGradients[item.category] || 'from-gray-600 to-gray-500';

  return (
    <div className="flex gap-3">
      <div className={clsx('w-16 h-16 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center', gradient)}>
        <span className="text-white/40 text-xl font-display font-bold">{item.name?.[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
        <p className="text-sm text-gray-400 mt-0.5">${Number(item.price).toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center bg-gray-800 rounded border border-white/10">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="w-7 text-center text-xs font-medium text-white">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className="text-sm font-medium text-white whitespace-nowrap">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';

const categoryGradients = {
  Electronics: 'from-blue-600 to-cyan-500',
  Clothing: 'from-pink-500 to-rose-400',
  Books: 'from-emerald-600 to-teal-400',
  'Home & Garden': 'from-amber-500 to-orange-400',
};

function StockBadge({ stock }) {
  if (stock <= 0) return <span className="flex items-center gap-1.5 text-xs text-red-400"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />Out of stock</span>;
  if (stock < 10) return <span className="flex items-center gap-1.5 text-xs text-yellow-400"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />Low stock</span>;
  return <span className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />In stock</span>;
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const gradient = categoryGradients[product.category] || 'from-gray-600 to-gray-500';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) addItem(product);
  };

  const productId = product._id || product.id;

  return (
    <Link href={`/products/${productId}`} className="group block">
      <div className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/20 group-hover:border-white/10">
        <div className={clsx('relative h-48 bg-gradient-to-br', gradient, 'flex items-center justify-center')}>
          <span className="text-white/30 text-6xl font-display font-bold">
            {product.name?.[0]}
          </span>
          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/30 backdrop-blur-sm text-[11px] font-medium text-white rounded-full">
            {product.category}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">${Number(product.price).toFixed(2)}</span>
            <StockBadge stock={product.stock} />
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={clsx(
              'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
              product.stock > 0
                ? 'bg-electric hover:bg-blue-600 text-white active:scale-[0.98]'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            )}
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

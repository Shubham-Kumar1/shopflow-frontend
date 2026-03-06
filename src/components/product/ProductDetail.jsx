'use client';

import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';

const categoryGradients = {
  Electronics: 'from-blue-600 to-cyan-500',
  Clothing: 'from-pink-500 to-rose-400',
  Books: 'from-emerald-600 to-teal-400',
  'Home & Garden': 'from-amber-500 to-orange-400',
};

function StockBadge({ stock }) {
  if (stock <= 0) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Out of stock</span>;
  if (stock < 10) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Low stock — {stock} left</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">In stock</span>;
}

function StarRating({ average = 0, count = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            className={clsx(
              i <= Math.round(average) ? 'text-amber fill-amber' : 'text-gray-600'
            )}
          />
        ))}
      </div>
      <span className="text-sm text-gray-400">
        {average > 0 ? `${Number(average).toFixed(1)} (${count} reviews)` : 'No reviews yet'}
      </span>
    </div>
  );
}

export default function ProductDetail({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const gradient = categoryGradients[product.category] || 'from-gray-600 to-gray-500';

  const handleAdd = async () => {
    if (product.stock <= 0) return;
    setAdding(true);
    await new Promise((r) => setTimeout(r, 400));
    addItem(product, quantity);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className={clsx('relative rounded-2xl bg-gradient-to-br', gradient, 'aspect-square flex items-center justify-center')}>
        <span className="text-white/20 text-[120px] font-display font-bold leading-none">
          {product.name?.[0]}
        </span>
        <span className="absolute top-4 left-4 px-3 py-1 bg-black/30 backdrop-blur-sm text-xs font-medium text-white rounded-full">
          {product.category}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white leading-tight">
            {product.name}
          </h1>
          {product.sku && (
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">SKU: {product.sku}</p>
          )}
        </div>

        <StarRating
          average={product.ratings?.average}
          count={product.ratings?.count}
        />

        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-white">${Number(product.price).toFixed(2)}</span>
          <StockBadge stock={product.stock} />
        </div>

        {product.description && (
          <p className="text-gray-400 leading-relaxed">{product.description}</p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center bg-gray-800 rounded-lg border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-sm font-medium text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0 || adding}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-medium transition-all',
              added
                ? 'bg-emerald-500 text-white'
                : product.stock > 0
                  ? 'bg-electric hover:bg-blue-600 text-white active:scale-[0.98]'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            )}
          >
            {adding ? (
              <Loader2 size={18} className="animate-spin" />
            ) : added ? (
              '✓ Added to Cart'
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

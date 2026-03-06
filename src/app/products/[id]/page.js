'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import ProductDetail from '@/components/product/ProductDetail';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      const { data, error: err } = await api.get(`/api/products/${id}`);
      if (err) {
        setError(err);
      } else {
        setProduct(data.data || data);
      }
      setLoading(false);
    }
    if (id) fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <Loader2 size={32} className="animate-spin text-electric" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-gray-400 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <button
          onClick={() => router.push('/products')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-electric hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.push('/products')}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Back to Products
      </button>
      <ProductDetail product={product} />
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import clsx from 'clsx';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get('category');
    return cat ? [cat] : [];
  });
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchTimer = useRef(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', '12');
    if (search) params.set('search', search);
    if (selectedCategories.length) params.set('category', selectedCategories.join(','));
    if (priceMin) params.set('minPrice', priceMin);
    if (priceMax) params.set('maxPrice', priceMax);
    if (sort) params.set('sort', sort);

    const { data } = await api.get(`/api/products?${params.toString()}`);
    if (data) {
      const payload = data.data || data;
      setProducts(payload.products || []);
      const pagination = payload.pagination;
      setTotalPages(pagination?.pages || Math.ceil((pagination?.total || 0) / 12) || 1);
    }
    setLoading(false);
  }, [page, search, selectedCategories, priceMin, priceMax, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setPage(1), 300);
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceMin('');
    setPriceMax('');
    setSearch('');
    setSort('newest');
    setPage(1);
  };

  const hasFilters = selectedCategories.length > 0 || priceMin || priceMax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Products</h1>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300 border border-white/10"
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className={clsx(
          'lg:block lg:w-64 flex-shrink-0',
          filtersOpen ? 'fixed inset-0 z-50 bg-gray-900 p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'
        )}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="text-lg font-semibold text-white">Filters</h2>
            <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-electric focus:ring-electric/50 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric/50"
                />
                <span className="text-gray-500">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric/50"
                />
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric/50"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-electric/50 appearance-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-700/50" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                    <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                    <div className="h-10 bg-gray-700/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

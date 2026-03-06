import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-display text-xl font-bold text-electric">ShopFlow</span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
              Premium shopping experience with fast delivery and curated products you&apos;ll love.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=Electronics" className="text-sm text-gray-400 hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=Clothing" className="text-sm text-gray-400 hover:text-white transition-colors">Clothing</Link></li>
              <li><Link href="/products?category=Books" className="text-sm text-gray-400 hover:text-white transition-colors">Books</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/orders" className="text-sm text-gray-400 hover:text-white transition-colors">Order History</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-400 hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} ShopFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

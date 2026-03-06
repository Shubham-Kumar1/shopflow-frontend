'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';

export default function Navbar({ onCartOpen }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display text-2xl font-bold text-electric tracking-tight">
            ShopFlow
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Products
            </Link>
            {user && (
              <Link
                href="/orders"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Orders
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onCartOpen}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-electric text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-electric/20 text-electric flex items-center justify-center font-semibold text-sm">
                    {user.firstName?.[0] || user.email?.[0] || 'U'}
                  </div>
                  <ChevronDown size={14} className={clsx('transition-transform', profileOpen && 'rotate-180')} />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-white/10 py-1 z-20">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-medium text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User size={14} />
                        My Orders
                      </Link>
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-electric hover:bg-blue-600 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-white/5">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-gray-300 hover:text-white py-2"
            >
              Products
            </Link>
            {user && (
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-300 hover:text-white py-2"
              >
                Orders
              </Link>
            )}
            {!user && (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-electric hover:text-blue-400 py-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

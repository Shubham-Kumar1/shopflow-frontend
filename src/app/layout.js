'use client';

import { DM_Sans, Syne } from 'next/font/google';
import { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

function LayoutInner({ children }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <head>
        <title>ShopFlow</title>
        <meta name="description" content="Premium e-commerce experience — fast delivery, curated products." />
      </head>
      <body className="font-sans bg-navy-900 text-gray-50 antialiased">
        <AuthProvider>
          <CartProvider>
            <LayoutInner>{children}</LayoutInner>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

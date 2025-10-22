"use client";

import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/config/sitemap';
import { Phone } from 'lucide-react';
import CartIcon from './CartIcon';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { state } = useCart();
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 z-10">
            <Image
              src="/images/bransol-logo-dark-2025.png"
              alt={SITE.brand.name}
              width={120}
              height={32}
              priority
              className="h-8 w-auto"
              style={{ height: "auto" }}
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">

            <Link
              href="/packages"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
              Packages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/subscriptions"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
              Subscriptions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/work"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
              Work
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* CTAs */}
          <div className="flex items-center space-x-4 flex-shrink-0 z-10">
            <Link
              href="/dashboard"
              className="hidden md:flex text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Client Portal
            </Link>
            <CartIcon />
            <Link
              href={SITE.ctas.book.href}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              <Phone className="w-4 h-4" />
              {SITE.ctas.book.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

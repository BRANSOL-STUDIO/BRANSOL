"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/config/sitemap';
import { Phone, ChevronDown } from 'lucide-react';
import CartIcon from './CartIcon';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { state } = useCart();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  
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
            {/* Home */}
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* About Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group flex items-center gap-1">
                About
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              
              {aboutOpen && (
                <div className="absolute top-full left-0 pt-2 w-48 z-50">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      href="/about"
                      className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      More Info
                    </Link>
                    <Link
                      href="/work"
                      className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Portfolio
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Packages Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setPackagesOpen(true)}
              onMouseLeave={() => setPackagesOpen(false)}
            >
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group flex items-center gap-1">
                Packages
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${packagesOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              
              {packagesOpen && (
                <div className="absolute top-full left-0 pt-2 w-48 z-50">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      href="/subscriptions"
                      className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Subscriptions
                    </Link>
                    <Link
                      href="/packages"
                      className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Individual Plans
                    </Link>
                  </div>
                </div>
              )}
            </div>
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

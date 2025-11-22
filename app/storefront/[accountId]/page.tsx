/**
 * Storefront Page
 * 
 * This page displays products from a connected account and allows
 * customers to make purchases.
 * 
 * IMPORTANT: In production, you should:
 * - Use a more secure identifier than accountId in the URL
 * - Add authentication/authorization
 * - Add product search and filtering
 * - Add shopping cart functionality
 * 
 * URL: /storefront/[accountId]
 * Example: /storefront/acct_1234567890
 */

"use client";

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, Loader2, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  active: boolean;
  price: {
    id: string;
    amount: number;
    currency: string;
    formatted: string;
  };
}

function StorefrontContent({ params }: { params: { accountId: string } }) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const accountId = params.accountId;
  const canceled = searchParams.get('canceled') === 'true';

  /**
   * Fetch products from the connected account
   */
  const fetchProducts = async () => {
    setFetching(true);
    setError(null);

    try {
      const response = await fetch(`/api/connect/products/list?accountId=${accountId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  /**
   * Handle product purchase
   * Creates a checkout session and redirects to Stripe Checkout
   */
  const handlePurchase = async (product: Product) => {
    setPurchasing(product.id);
    setError(null);

    try {
      // Calculate application fee (example: 10% of product price)
      // In production, you might want to make this configurable
      const applicationFeeAmount = Math.round(product.price.amount * 10);

      const response = await fetch('/api/connect/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: accountId,
          priceId: product.price.id,
          quantity: 1,
          applicationFeeAmount: applicationFeeAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message);
      setPurchasing(null);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    if (accountId) {
      fetchProducts();
    }
  }, [accountId]);

  // Show success message if redirected from success page
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
  }, [searchParams]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <ShoppingBag className="w-10 h-10 text-purple-600" />
              Storefront
            </h1>
            <p className="text-gray-600">
              {/* TODO: In production, get store name from account or database */}
              Browse and purchase products
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">
                Payment successful! Thank you for your purchase.
              </p>
            </div>
          )}

          {canceled && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">
                Payment was canceled. You can continue shopping.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {fetching ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No products available</p>
              <p className="text-sm text-gray-500">
                This storefront doesn't have any products yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Product Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-16 h-16 text-purple-300" />
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-bold text-gray-900">
                        {product.price.formatted}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePurchase(product)}
                      disabled={purchasing === product.id || !product.active}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {purchasing === product.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-sm text-blue-800">
              <strong>Secure checkout</strong> powered by Stripe. Your payment information is safe and encrypted.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function StorefrontPage({ params }: { params: { accountId: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <StorefrontContent params={params} />
    </Suspense>
  );
}


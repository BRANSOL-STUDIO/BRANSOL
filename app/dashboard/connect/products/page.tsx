/**
 * Product Management Page
 * 
 * This page allows connected accounts to:
 * 1. Create products
 * 2. View their products
 * 3. Manage their product catalog
 * 
 * IMPORTANT: In production, get accountId from authenticated user's database record
 */

"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Package, Loader2, AlertCircle, X } from 'lucide-react';

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceInCents: '',
    currency: 'usd',
  });

  /**
   * Get account ID from localStorage or URL
   * TODO: In production, get from authenticated user's database record
   */
  const getAccountId = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('accountId') || localStorage.getItem('stripeAccountId');
  };

  /**
   * Fetch products from connected account
   */
  const fetchProducts = async () => {
    const accountId = getAccountId();
    if (!accountId) {
      setError('No account ID found. Please create an account first.');
      return;
    }

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
   * Create a new product
   */
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const accountId = getAccountId();

    if (!accountId) {
      setError('No account ID found. Please create an account first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const priceInCents = Math.round(parseFloat(formData.priceInCents) * 100);

      if (isNaN(priceInCents) || priceInCents <= 0) {
        throw new Error('Invalid price');
      }

      const response = await fetch('/api/connect/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          name: formData.name,
          description: formData.description || undefined,
          priceInCents,
          currency: formData.currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      // Reset form and refresh products
      setFormData({ name: '', description: '', priceInCents: '', currency: 'usd' });
      setShowForm(false);
      await fetchProducts();

      alert('Product created successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const accountId = getAccountId();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">
                Create and manage products for your storefront
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {showForm ? 'Cancel' : 'Create Product'}
            </button>
          </div>

          {!accountId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">No Account Found</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Please create a connected account first at{' '}
                    <a href="/dashboard/connect" className="underline">/dashboard/connect</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button onClick={() => setError(null)}>
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          )}

          {/* Create Product Form */}
          {showForm && accountId && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Product</h2>

              <form onSubmit={handleCreateProduct} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Premium Design Package"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priceInCents" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (in dollars) *
                    </label>
                    <input
                      type="number"
                      id="priceInCents"
                      required
                      step="0.01"
                      min="0.01"
                      value={formData.priceInCents}
                      onChange={(e) => setFormData({ ...formData, priceInCents: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="99.99"
                    />
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                      Currency *
                    </label>
                    <select
                      id="currency"
                      required
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="cad">CAD ($)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Product
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-purple-600" />
                Your Products ({products.length})
              </h2>
              <button
                onClick={fetchProducts}
                disabled={fetching}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
              >
                {fetching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Refresh'
                )}
              </button>
            </div>

            {fetching && products.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No products yet</p>
                <p className="text-sm text-gray-500">
                  Create your first product to get started
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price.formatted}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <a
                      href={`/storefront/${accountId}?product=${product.id}`}
                      className="mt-4 block text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View in Storefront →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


/**
 * Checkout Success Page
 * 
 * This page is shown after a successful purchase.
 * 
 * URL: /storefront/[accountId]/success?session_id=cs_...
 */

"use client";

import { useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const sessionId = searchParams.get('session_id');
  const accountId = params.accountId as string;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>

            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your order has been processed successfully.
            </p>

            {sessionId && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Session ID</p>
                <code className="text-xs text-gray-800">{sessionId}</code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/storefront/${accountId}`}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                A receipt has been sent to your email address.
                {/* TODO: In production, retrieve and display customer email from session */}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


/**
 * API Route: List Products from Connected Account
 * 
 * This endpoint retrieves all active products from a connected account.
 * Used for displaying products in a storefront.
 * 
 * GET /api/connect/products/list?accountId=acct_...
 * 
 * Response:
 * {
 *   products: array,         // Array of product objects with prices
 *   count: number           // Total number of products
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, getConnectedAccountId } from '@/lib/stripe/connect';

export async function GET(request: NextRequest) {
  try {
    // Get Stripe client instance
    const stripeClient = getStripeClient();

    // Get account ID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    // Validate and get account ID
    const connectedAccountId = getConnectedAccountId(accountId);

    /**
     * List products from the connected account
     * 
     * IMPORTANT: Use the stripeAccount option to retrieve products
     * from the connected account, not the platform account.
     * 
     * We expand 'data.default_price' to get full price information
     * without making additional API calls.
     */
    const products = await stripeClient.products.list(
      {
        // Only get active products
        active: true,
        
        // Limit results (adjust as needed)
        limit: 20,
        
        // Expand default_price to get full price object
        expand: ['data.default_price'],
      },
      {
        // CRITICAL: This sets the Stripe-Account header
        // Without this, you'd get products from the platform account
        stripeAccount: connectedAccountId,
      }
    );

    /**
     * Format products for frontend consumption
     * Extract relevant information and format prices
     */
    const formattedProducts = products.data.map((product) => {
      const price = product.default_price;
      const priceAmount = typeof price === 'object' && price !== null
        ? (price.unit_amount || 0) / 100 // Convert cents to dollars
        : 0;
      const priceCurrency = typeof price === 'object' && price !== null
        ? price.currency?.toUpperCase() || 'USD'
        : 'USD';

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        active: product.active,
        price: {
          id: typeof price === 'string' ? price : price?.id,
          amount: priceAmount,
          currency: priceCurrency,
          formatted: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: priceCurrency,
          }).format(priceAmount),
        },
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      count: formattedProducts.length,
    });
  } catch (error: any) {
    console.error('Error listing products:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to list products',
        details: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}


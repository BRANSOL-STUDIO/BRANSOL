/**
 * API Route: Create Product on Connected Account
 * 
 * This endpoint creates a product on a connected account.
 * Products are created on the connected account, not the platform account.
 * 
 * POST /api/connect/products/create
 * 
 * Request body:
 * {
 *   accountId: string,        // Connected account ID (acct_...)
 *   name: string,             // Product name
 *   description: string,      // Product description
 *   priceInCents: number,     // Price in cents (e.g., 1000 = $10.00)
 *   currency: string          // Currency code (e.g., 'usd', 'eur')
 * }
 * 
 * Response:
 * {
 *   product: object,          // Created product object
 *   price: object            // Created price object
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, getConnectedAccountId } from '@/lib/stripe/connect';

export async function POST(request: NextRequest) {
  try {
    // Get Stripe client instance
    const stripeClient = getStripeClient();

    // Parse request body
    const body = await request.json();
    const { accountId, name, description, priceInCents, currency = 'usd' } = body;

    // Validate required fields
    if (!accountId || !name || !priceInCents) {
      return NextResponse.json(
        { error: 'accountId, name, and priceInCents are required' },
        { status: 400 }
      );
    }

    // Validate price is positive
    if (priceInCents <= 0) {
      return NextResponse.json(
        { error: 'priceInCents must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate and get account ID
    const connectedAccountId = getConnectedAccountId(accountId);

    /**
     * Create a product on the connected account
     * 
     * IMPORTANT: Use the stripeAccount option to specify which account
     * the product should be created on. This sets the Stripe-Account header.
     * 
     * Products created this way belong to the connected account, not the platform.
     */
    const product = await stripeClient.products.create(
      {
        name: name,
        description: description || undefined,
        
        // Create a default price along with the product
        // This is a convenience method - you can also create prices separately
        default_price_data: {
          // Price in smallest currency unit (cents for USD)
          unit_amount: priceInCents,
          
          // Currency code (ISO 4217)
          currency: currency.toLowerCase(),
        },
      },
      {
        // CRITICAL: This sets the Stripe-Account header
        // All operations with this option will be performed on the connected account
        stripeAccount: connectedAccountId,
      }
    );

    /**
     * TODO: Store product information in your database
     * 
     * Example:
     * await db.products.create({
     *   data: {
     *     stripeProductId: product.id,
     *     stripePriceId: product.default_price,
     *     accountId: connectedAccountId,
     *     name: product.name,
     *     price: priceInCents,
     *     currency: currency,
     *   }
     * });
     */

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        active: product.active,
      },
      price: {
        id: product.default_price,
        amount: priceInCents,
        currency: currency,
      },
      message: 'Product created successfully on connected account.',
    });
  } catch (error: any) {
    console.error('Error creating product:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create product',
        details: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}


/**
 * API Route: Create Connected Account
 * 
 * This endpoint creates a new Stripe Connect account using the V2 API.
 * 
 * POST /api/connect/create-account
 * 
 * Request body:
 * {
 *   displayName: string,    // Business/account display name
 *   contactEmail: string,   // Contact email for the account
 *   country: string         // ISO country code (e.g., 'us', 'gb', 'ca')
 * }
 * 
 * Response:
 * {
 *   accountId: string,      // The created account ID (acct_...)
 *   account: object         // Full account object
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/connect';

export async function POST(request: NextRequest) {
  try {
    // Get Stripe client instance
    const stripeClient = getStripeClient();

    // Parse request body
    const body = await request.json();
    const { displayName, contactEmail, country = 'us' } = body;

    // Validate required fields
    if (!displayName || !contactEmail) {
      return NextResponse.json(
        { error: 'displayName and contactEmail are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    /**
     * Create a Connected Account using Stripe Connect V2 API
     * 
     * IMPORTANT: 
     * - Do NOT use top-level 'type' property (no type: 'express', 'standard', or 'custom')
     * - Use the V2 API structure as shown below
     * - The account will be created with full dashboard access
     * - Stripe will handle fees and losses by default
     */
    const account = await stripeClient.v2.core.accounts.create({
      // Display name shown in Stripe Dashboard
      display_name: displayName,
      
      // Contact email for the account
      contact_email: contactEmail,
      
      // Identity information - country is required
      identity: {
        country: country.toLowerCase(),
      },
      
      // Dashboard access level - 'full' gives complete access
      dashboard: 'full',
      
      // Default responsibilities
      // Stripe will collect fees and handle losses
      defaults: {
        responsibilities: {
          fees_collector: 'stripe',
          losses_collector: 'stripe',
        },
      },
      
      // Configuration for different account types
      configuration: {
        // Customer configuration (for when account acts as a customer)
        customer: {},
        
        // Merchant configuration (for accepting payments)
        merchant: {
          capabilities: {
            // Request card payment capability
            card_payments: {
              requested: true,
            },
          },
        },
      },
    });

    /**
     * TODO: Store the account mapping in your database
     * 
     * Example database operation:
     * 
     * await db.users.update({
     *   where: { id: userId },
     *   data: { stripeAccountId: account.id }
     * });
     * 
     * This mapping is crucial for:
     * - Associating users with their Stripe accounts
     * - Retrieving account ID for authenticated users
     * - Security (ensuring users can only access their own accounts)
     */

    return NextResponse.json({
      accountId: account.id,
      account: account,
      message: 'Connected account created successfully. Store accountId in your database.',
    });
  } catch (error: any) {
    console.error('Error creating connected account:', error);
    
    return NextResponse.json(
      {
        error: error.message || 'Failed to create connected account',
        details: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}


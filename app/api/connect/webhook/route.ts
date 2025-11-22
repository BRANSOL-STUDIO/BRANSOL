/**
 * API Route: Stripe Connect Webhook Handler
 * 
 * This endpoint handles webhook events from Stripe for:
 * 1. Thin events for V2 account updates (requirements, capabilities)
 * 2. Subscription events (created, updated, deleted)
 * 3. Payment method events
 * 4. Customer events
 * 5. Billing portal events
 * 
 * POST /api/connect/webhook
 * 
 * IMPORTANT: Configure this endpoint in Stripe Dashboard:
 * 1. Go to Developers > Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/connect/webhook
 * 3. For thin events: Select "Thin" payload style
 * 4. Select events:
 *    - v2.core.account[requirements].updated
 *    - v2.core.account[configuration.merchant].capability_status_updated
 *    - v2.core.account[configuration.customer].capability_status_updated
 *    - customer.subscription.created
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - payment_method.attached
 *    - payment_method.detached
 *    - customer.updated
 *    - customer.tax_id.*
 *    - billing_portal.*
 * 
 * For local testing, use Stripe CLI:
 * stripe listen --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated' --forward-thin-to http://localhost:3000/api/connect/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/connect';
import Stripe from 'stripe';

// Disable body parsing - we need raw body for webhook signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get Stripe client instance
    const stripeClient = getStripeClient();

    // Get raw body and signature
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    // Get webhook secret from environment
    // IMPORTANT: Replace with your actual webhook secret from Stripe Dashboard
    const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_CONNECT_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      /**
       * Parse thin event
       * 
       * Thin events are lightweight webhook payloads that require
       * fetching the full event data using the event ID.
       * 
       * This is required for V2 account events.
       * 
       * NOTE: parseThinEvent may not be available in all SDK versions.
       * If it's not available, the SDK will throw an error and we'll
       * fall back to regular event parsing.
       */
      try {
        // Try to parse as thin event first (for V2 account events)
        // @ts-ignore - parseThinEvent may not be in TypeScript definitions yet
        const thinEvent = stripeClient.parseThinEvent?.(body, sig, webhookSecret);

        if (thinEvent && thinEvent.id) {
          /**
           * Retrieve the full event data
           * 
           * Thin events only contain the event ID and type.
           * We need to fetch the full event to get all the data.
           */
          event = await stripeClient.v2.core.events.retrieve(thinEvent.id);
        } else {
          throw new Error('Thin event parsing not available, using regular event parsing');
        }
      } catch (thinError: any) {
        // If thin event parsing fails or is not available,
        // try parsing as regular event (for non-thin events like subscription events)
        event = stripeClient.webhooks.constructEvent(body, sig, webhookSecret);
      }
    } catch (parseError: any) {
      console.error('Webhook signature verification failed:', parseError.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    /**
     * Handle different event types
     * 
     * Use event.type to determine which handler to call
     */
    switch (event.type) {
      // ============================================
      // V2 Account Events (Thin Events)
      // ============================================

      case 'v2.core.account[requirements].updated': {
        /**
         * Handle account requirements updates
         * 
         * This event fires when:
         * - New requirements are added
         * - Requirements status changes
         * - Requirements are completed
         * 
         * IMPORTANT: Account requirements can change due to:
         * - Regulatory changes
         * - Card network requirements
         * - Financial institution policies
         */
        const account = event.data.object as any;
        const accountId = account.id;
        const requirementsStatus = account.requirements?.summary?.minimum_deadline?.status;

        console.log(`Account requirements updated: ${accountId}`);
        console.log(`Requirements status: ${requirementsStatus}`);

        /**
         * TODO: Update account requirements status in your database
         * 
         * Example:
         * await db.accounts.update({
         *   where: { stripeAccountId: accountId },
         *   data: {
         *     requirementsStatus: requirementsStatus,
         *     requirementsUpdatedAt: new Date(),
         *   }
         * });
         * 
         * TODO: Notify the user if requirements are due
         * 
         * Example:
         * if (requirementsStatus === 'currently_due' || requirementsStatus === 'past_due') {
         *   await sendNotificationEmail(accountId, 'requirements_due');
         * }
         */

        break;
      }

      case 'v2.core.account[configuration.merchant].capability_status_updated': {
        /**
         * Handle merchant capability status updates
         * 
         * This event fires when payment capabilities change status:
         * - pending -> active (can now accept payments)
         * - active -> restricted (payments restricted)
         * - etc.
         */
        const account = event.data.object as any;
        const accountId = account.id;
        const cardPaymentsStatus =
          account.configuration?.merchant?.capabilities?.card_payments?.status;

        console.log(`Merchant capability updated: ${accountId}`);
        console.log(`Card payments status: ${cardPaymentsStatus}`);

        /**
         * TODO: Update capability status in your database
         * 
         * Example:
         * await db.accounts.update({
         *   where: { stripeAccountId: accountId },
         *   data: {
         *     canAcceptPayments: cardPaymentsStatus === 'active',
         *     capabilityStatus: cardPaymentsStatus,
         *   }
         * });
         */

        break;
      }

      case 'v2.core.account[configuration.customer].capability_status_updated': {
        /**
         * Handle customer capability status updates
         * 
         * This event fires when the account's ability to act as a customer changes.
         */
        const account = event.data.object as any;
        const accountId = account.id;

        console.log(`Customer capability updated: ${accountId}`);

        /**
         * TODO: Update customer capability status in your database
         */

        break;
      }

      // ============================================
      // Subscription Events
      // ============================================

      case 'customer.subscription.created': {
        /**
         * Handle subscription creation
         * 
         * This event fires when a new subscription is created.
         * Grant access to the product/service immediately.
         */
        const subscription = event.data.object as Stripe.Subscription;

        // For V2 accounts, get customer_account instead of customer
        const accountId = (subscription as any).customer_account || subscription.customer;

        console.log(`Subscription created: ${subscription.id}`);
        console.log(`Account: ${accountId}`);

        /**
         * TODO: Store subscription in your database
         * 
         * Example:
         * await db.subscriptions.create({
         *   data: {
         *     stripeSubscriptionId: subscription.id,
         *     accountId: accountId,
         *     status: subscription.status,
         *     priceId: subscription.items.data[0]?.price.id,
         *     quantity: subscription.items.data[0]?.quantity,
         *     currentPeriodStart: new Date(subscription.current_period_start * 1000),
         *     currentPeriodEnd: new Date(subscription.current_period_end * 1000),
         *   }
         * });
         * 
         * TODO: Grant access to the product/service
         * 
         * Example:
         * await grantProductAccess(accountId, subscription.items.data[0]?.price.id);
         */

        break;
      }

      case 'customer.subscription.updated': {
        /**
         * Handle subscription updates
         * 
         * This event fires when:
         * - Subscription is upgraded/downgraded
         * - Quantity changes
         * - Trial ends
         * - Subscription is reactivated after cancellation
         * - Pause collection status changes
         */
        const subscription = event.data.object as Stripe.Subscription;
        const accountId = (subscription as any).customer_account || subscription.customer;

        console.log(`Subscription updated: ${subscription.id}`);

        // Check for upgrades/downgrades
        const priceId = subscription.items.data[0]?.price.id;
        const quantity = subscription.items.data[0]?.quantity;

        // Check if subscription was reactivated
        const wasReactivated = subscription.cancel_at_period_end === false;

        // Check if collection is paused
        const isPaused = subscription.pause_collection !== null;

        /**
         * TODO: Update subscription in your database
         * 
         * Example:
         * await db.subscriptions.update({
         *   where: { stripeSubscriptionId: subscription.id },
         *   data: {
         *     status: subscription.status,
         *     priceId: priceId,
         *     quantity: quantity,
         *     cancelAtPeriodEnd: subscription.cancel_at_period_end,
         *     currentPeriodEnd: new Date(subscription.current_period_end * 1000),
         *   }
         * });
         * 
         * TODO: Update product access based on new price/quantity
         * 
         * Example:
         * if (wasReactivated) {
         *   await grantProductAccess(accountId, priceId);
         * } else {
         *   await updateProductAccess(accountId, priceId, quantity);
         * }
         * 
         * TODO: Handle paused collections
         * 
         * Example:
         * if (isPaused) {
         *   await pauseProductAccess(accountId);
         * } else {
         *   await resumeProductAccess(accountId);
         * }
         */

        break;
      }

      case 'customer.subscription.deleted': {
        /**
         * Handle subscription cancellation
         * 
         * This event fires when a subscription is fully canceled.
         * Revoke access to the product/service immediately.
         */
        const subscription = event.data.object as Stripe.Subscription;
        const accountId = (subscription as any).customer_account || subscription.customer;

        console.log(`Subscription deleted: ${subscription.id}`);

        /**
         * TODO: Update subscription status in your database
         * 
         * Example:
         * await db.subscriptions.update({
         *   where: { stripeSubscriptionId: subscription.id },
         *   data: {
         *     status: 'canceled',
         *     canceledAt: new Date(),
         *   }
         * });
         * 
         * TODO: Revoke access to the product/service
         * 
         * Example:
         * await revokeProductAccess(accountId);
         */

        break;
      }

      // ============================================
      // Payment Method Events
      // ============================================

      case 'payment_method.attached': {
        /**
         * Handle payment method attachment
         * 
         * This event fires when a customer adds a payment method.
         */
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        const customerId = paymentMethod.customer;

        console.log(`Payment method attached: ${paymentMethod.id}`);

        /**
         * TODO: Store payment method information in your database
         * 
         * Example:
         * await db.paymentMethods.create({
         *   data: {
         *     stripePaymentMethodId: paymentMethod.id,
         *     accountId: customerId, // For V2, this is the account ID
         *     type: paymentMethod.type,
         *     isDefault: false,
         *   }
         * });
         */

        break;
      }

      case 'payment_method.detached': {
        /**
         * Handle payment method removal
         * 
         * This event fires when a customer removes a payment method.
         */
        const paymentMethod = event.data.object as Stripe.PaymentMethod;

        console.log(`Payment method detached: ${paymentMethod.id}`);

        /**
         * TODO: Remove payment method from your database
         * 
         * Example:
         * await db.paymentMethods.delete({
         *   where: { stripePaymentMethodId: paymentMethod.id }
         * });
         */

        break;
      }

      // ============================================
      // Customer Events
      // ============================================

      case 'customer.updated': {
        /**
         * Handle customer updates
         * 
         * This event fires when customer information is updated.
         * IMPORTANT: Only use for billing information, not authentication.
         */
        const customer = event.data.object as Stripe.Customer;
        const accountId = (customer as any).customer_account || customer.id;

        console.log(`Customer updated: ${accountId}`);

        /**
         * TODO: Update customer information in your database
         * 
         * Example:
         * await db.accounts.update({
         *   where: { stripeAccountId: accountId },
         *   data: {
         *     billingEmail: customer.email,
         *     defaultPaymentMethod: customer.invoice_settings?.default_payment_method,
         *   }
         * });
         * 
         * WARNING: Do NOT use customer email as a login credential!
         * This is billing information only.
         */

        break;
      }

      // ============================================
      // Tax ID Events
      // ============================================

      case 'customer.tax_id.created':
      case 'customer.tax_id.updated':
      case 'customer.tax_id.deleted': {
        /**
         * Handle tax ID management
         * 
         * These events fire when customers manage their tax IDs
         * in the billing portal.
         */
        const taxId = event.data.object as Stripe.TaxId;
        const customerId = taxId.customer;

        console.log(`Tax ID ${event.type}: ${taxId.id}`);

        /**
         * TODO: Update tax ID information in your database
         * 
         * Example:
         * if (event.type === 'customer.tax_id.deleted') {
         *   await db.taxIds.delete({
         *     where: { stripeTaxId: taxId.id }
         *   });
         * } else {
         *   await db.taxIds.upsert({
         *     where: { stripeTaxId: taxId.id },
         *     update: {
         *       type: taxId.type,
         *       value: taxId.value,
         *       verification: taxId.verification,
         *     },
         *     create: {
         *       stripeTaxId: taxId.id,
         *       accountId: customerId,
         *       type: taxId.type,
         *       value: taxId.value,
         *     }
         *   });
         * }
         */

        break;
      }

      // ============================================
      // Billing Portal Events
      // ============================================

      case 'billing_portal.configuration.created':
      case 'billing_portal.configuration.updated':
      case 'billing_portal.session.created': {
        /**
         * Handle billing portal events
         * 
         * These events fire when billing portal configurations
         * or sessions are created/updated.
         */
        console.log(`Billing portal event: ${event.type}`);

        /**
         * TODO: Log billing portal activity if needed
         */

        break;
      }

      // ============================================
      // Invoice Events (for subscription payments)
      // ============================================

      case 'invoice.paid': {
        /**
         * Handle successful invoice payment
         * 
         * This event fires when a subscription invoice is paid.
         * Use this to confirm access renewal.
         */
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription;
        const accountId = (invoice as any).customer_account || invoice.customer;

        console.log(`Invoice paid: ${invoice.id}`);
        console.log(`Subscription: ${subscriptionId}`);

        /**
         * TODO: Update subscription payment status in your database
         * 
         * Example:
         * await db.subscriptions.update({
         *   where: { stripeSubscriptionId: subscriptionId },
         *   data: {
         *     lastPaymentAt: new Date(),
         *     lastInvoiceId: invoice.id,
         *   }
         * });
         * 
         * TODO: Ensure product access is active
         * 
         * Example:
         * await ensureProductAccess(accountId);
         */

        break;
      }

      case 'invoice.payment_failed': {
        /**
         * Handle failed invoice payment
         * 
         * This event fires when a subscription invoice payment fails.
         * You may want to notify the user or restrict access.
         */
        const invoice = event.data.object as Stripe.Invoice;
        const accountId = (invoice as any).customer_account || invoice.customer;

        console.log(`Invoice payment failed: ${invoice.id}`);

        /**
         * TODO: Handle payment failure
         * 
         * Example:
         * await db.subscriptions.update({
         *   where: { stripeSubscriptionId: invoice.subscription },
         *   data: {
         *     paymentFailed: true,
         *     lastPaymentFailureAt: new Date(),
         *   }
         * });
         * 
         * TODO: Notify user of payment failure
         * 
         * Example:
         * await sendPaymentFailureEmail(accountId);
         */

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}


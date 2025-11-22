import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;

// Create Supabase admin client (uses service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Initialize Resend if API key is available
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Generate a random password
 */
function generatePassword(): string {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Create a user account in Supabase
 */
export async function createUserAccount(
  email: string,
  fullName: string,
  subscriptionData: {
    planName: string;
    planSlug: string;
    billingCycle: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  }
) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    
    if (existingUser?.user) {
      console.log(`User ${email} already exists, updating profile...`);
      
      // Update profile with subscription info
      // Try to update new columns, fall back to plan column if they don't exist
      const updateData: any = {
        plan: subscriptionData.planName,
      };
      
      // Try to add subscription fields if they exist
      try {
        updateData.subscription_plan = subscriptionData.planSlug;
        updateData.subscription_status = 'active';
        if (subscriptionData.stripeCustomerId) {
          updateData.stripe_customer_id = subscriptionData.stripeCustomerId;
        }
        if (subscriptionData.stripeSubscriptionId) {
          updateData.stripe_subscription_id = subscriptionData.stripeSubscriptionId;
        }
      } catch (e) {
        // Columns might not exist yet, just use plan
      }

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', existingUser.user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      return {
        userId: existingUser.user.id,
        email: existingUser.user.email,
        password: null, // User already has password
        isNewUser: false,
      };
    }

    // Generate a random password
    const password = generatePassword();

    // Create new user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError || !authData.user) {
      console.error('Error creating user:', authError);
      throw authError || new Error('Failed to create user');
    }

    // Create profile
    const profileData: any = {
      id: authData.user.id,
      email: authData.user.email,
      full_name: fullName,
      plan: subscriptionData.planName,
    };

    // Add subscription fields if they exist in the schema
    try {
      profileData.subscription_plan = subscriptionData.planSlug;
      profileData.subscription_status = 'active';
      if (subscriptionData.stripeCustomerId) {
        profileData.stripe_customer_id = subscriptionData.stripeCustomerId;
      }
      if (subscriptionData.stripeSubscriptionId) {
        profileData.stripe_subscription_id = subscriptionData.stripeSubscriptionId;
      }
    } catch (e) {
      // Columns might not exist yet, just use plan
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Try to delete the user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return {
      userId: authData.user.id,
      email: authData.user.email,
      password,
      isNewUser: true,
    };
  } catch (error: any) {
    console.error('Error in createUserAccount:', error);
    throw error;
  }
}

/**
 * Send receipt email to user
 */
export async function sendReceiptEmail(
  email: string,
  fullName: string,
  receiptData: {
    planName: string;
    amount: number;
    currency: string;
    invoiceUrl?: string;
    accountCreated: boolean;
    password?: string;
    loginUrl: string;
  }
) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: `BRANSOL <${fromEmail}>`,
      to: email,
      subject: `Welcome to BRANSOL - Receipt for ${receiptData.planName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to BRANSOL</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to BRANSOL!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px;">Hi ${fullName},</p>
              
              <p style="font-size: 16px;">Thank you for your subscription to <strong>${receiptData.planName}</strong>!</p>
              
              ${receiptData.accountCreated ? `
                <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px;"><strong>Your account has been created!</strong></p>
                  ${receiptData.password ? `
                    <p style="margin: 10px 0 0 0; font-size: 14px;">
                      <strong>Your temporary password:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${receiptData.password}</code>
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 14px;">Please change your password after logging in.</p>
                  ` : ''}
                </div>
              ` : ''}
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <h2 style="margin-top: 0; color: #1f2937;">Receipt</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Plan:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${receiptData.planName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${receiptData.currency} ${receiptData.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Status:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #10b981;"><strong>Paid</strong></td>
                  </tr>
                </table>
              </div>
              
              ${receiptData.invoiceUrl ? `
                <p style="font-size: 14px; margin: 20px 0;">
                  <a href="${receiptData.invoiceUrl}" style="color: #667eea; text-decoration: none;">View Invoice →</a>
                </p>
              ` : ''}
              
              <div style="margin: 30px 0;">
                <a href="${receiptData.loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Your Dashboard</a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you have any questions, please don't hesitate to contact us.
              </p>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                Best regards,<br>
                The BRANSOL Team
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error in sendReceiptEmail:', error);
    return { success: false, error: error.message };
  }
}


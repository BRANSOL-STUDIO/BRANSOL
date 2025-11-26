import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      company,
      projectType,
      projectBudget,
      preferredDate,
      preferredTime,
      timezone,
      message
    } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert booking into database
    const { data: booking, error: dbError } = await supabaseAdmin
      .from('bookings')
      .insert({
        full_name: fullName,
        email: email,
        phone: phone || null,
        company: company || null,
        project_type: projectType || null,
        project_budget: projectBudget || null,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        timezone: timezone || null,
        message: message || null,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save booking. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email to the lead
    if (resend && process.env.RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: email,
          subject: 'Consultation Request Received - BRANSOL',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                  .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9333ea; }
                  .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Thank You for Your Interest!</h1>
                  </div>
                  <div class="content">
                    <p>Hi ${fullName},</p>
                    <p>We've received your consultation request and we're excited to learn more about your project!</p>
                    
                    <div class="info-box">
                      <h3 style="margin-top: 0; color: #9333ea;">What Happens Next?</h3>
                      <ul>
                        <li>Our team will review your request within 24 hours</li>
                        <li>We'll contact you to confirm your preferred consultation time</li>
                        <li>You'll receive a calendar invite with meeting details</li>
                      </ul>
                    </div>

                    ${preferredDate ? `
                      <div class="info-box">
                        <h3 style="margin-top: 0; color: #9333ea;">Your Requested Details:</h3>
                        <p><strong>Preferred Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
                        ${preferredTime ? `<p><strong>Preferred Time:</strong> ${preferredTime}</p>` : ''}
                        ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
                        ${projectBudget ? `<p><strong>Budget Range:</strong> ${projectBudget}</p>` : ''}
                      </div>
                    ` : ''}

                    <p>If you have any questions before our call, feel free to reply to this email.</p>
                    <p>We look forward to speaking with you soon!</p>
                    <p>Best regards,<br>The BRANSOL Team</p>
                  </div>
                  <div class="footer">
                    <p>BRANSOL - Smart Branding. Human Creativity.</p>
                  </div>
                </div>
              </body>
            </html>
          `
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Send notification email to admin/team
    if (resend && process.env.RESEND_FROM_EMAIL && process.env.RESEND_TO_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.RESEND_TO_EMAIL,
          subject: `New Consultation Request: ${fullName}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                  .info-row { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #9333ea; }
                  .label { font-weight: bold; color: #6b7280; }
                  .value { color: #111827; margin-top: 5px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>New Consultation Request</h1>
                  </div>
                  <div class="content">
                    <div class="info-row">
                      <div class="label">Full Name</div>
                      <div class="value">${fullName}</div>
                    </div>
                    <div class="info-row">
                      <div class="label">Email</div>
                      <div class="value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    ${phone ? `
                      <div class="info-row">
                        <div class="label">Phone</div>
                        <div class="value"><a href="tel:${phone}">${phone}</a></div>
                      </div>
                    ` : ''}
                    ${company ? `
                      <div class="info-row">
                        <div class="label">Company</div>
                        <div class="value">${company}</div>
                      </div>
                    ` : ''}
                    ${projectType ? `
                      <div class="info-row">
                        <div class="label">Project Type</div>
                        <div class="value">${projectType}</div>
                      </div>
                    ` : ''}
                    ${projectBudget ? `
                      <div class="info-row">
                        <div class="label">Budget Range</div>
                        <div class="value">${projectBudget}</div>
                      </div>
                    ` : ''}
                    ${preferredDate ? `
                      <div class="info-row">
                        <div class="label">Preferred Date</div>
                        <div class="value">${new Date(preferredDate).toLocaleDateString()}</div>
                      </div>
                    ` : ''}
                    ${preferredTime ? `
                      <div class="info-row">
                        <div class="label">Preferred Time</div>
                        <div class="value">${preferredTime}</div>
                      </div>
                    ` : ''}
                    ${timezone ? `
                      <div class="info-row">
                        <div class="label">Timezone</div>
                        <div class="value">${timezone}</div>
                      </div>
                    ` : ''}
                    ${message ? `
                      <div class="info-row">
                        <div class="label">Message</div>
                        <div class="value">${message.replace(/\n/g, '<br>')}</div>
                      </div>
                    ` : ''}
                    <div class="info-row">
                      <div class="label">Booking ID</div>
                      <div class="value">${booking.id}</div>
                    </div>
                    <div class="info-row">
                      <div class="label">Submitted</div>
                      <div class="value">${new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `
        });
      } catch (emailError) {
        console.error('Admin notification email error:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: 'Booking request submitted successfully'
    });

  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}


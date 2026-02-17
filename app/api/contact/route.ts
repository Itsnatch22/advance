import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import {ContactNotification} from "@/emails/ContactNotification";

/* ----------------------------- validation ----------------------------- */

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000),
  honeypot: z.string().optional(),
});

/* ----------------------------- rate limiting ----------------------------- */

// Simple in-memory rate limiter (consider Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5; // 5 requests per hour

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: maxRequests - record.count };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

/* ----------------------------- clients ----------------------------- */

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@contact.eaziwage.com";

/* ----------------------------- handler ----------------------------- */

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               request.headers.get("x-real-ip") || 
               "unknown";

    const rateLimitResult = checkRateLimit(ip);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please try again later.",
          message: "Too many requests from this IP address"
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    const parsed = contactSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Bot detection (honeypot)
    if (parsed.data.honeypot) {
      console.log(`Bot detected from IP: ${ip}`);
      // Return success to not alert the bot
      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 200 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Validate email service is configured
    if (!resend) {
      console.error("Resend API key not configured");
      return NextResponse.json(
        { error: "Email service is not available. Please try again later." },
        { status: 503 }
      );
    }

    // Store in Supabase (non-blocking, continue even if it fails)
    if (supabase) {
      const { error: dbError } = await supabase
        .from("contacts")
        .insert([
          {
            name,
            email,
            subject,
            message,
            ip_address: ip,
            user_agent: request.headers.get("user-agent") || "unknown",
            submitted_at: new Date().toISOString(),
          },
        ]);

      if (dbError) {
        console.error("Database error:", dbError);
        // Don't fail the request, just log it
      }
    }

    const submittedAt = new Date();

    // Send notification to support team
    try {
      await resend.emails.send({
        from: `EaziWage Contact <${SUPPORT_EMAIL}>`,
        to: SUPPORT_EMAIL,
        replyTo: email,
        subject: `[Contact Form] ${subject}`,
        react: ContactNotification({
          name,
          email,
          subject,
          message,
          submittedAt: submittedAt.toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          }),
        }),
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Continue to send auto-reply even if notification fails
    }

    // Send auto-reply to user
    try {
      await resend.emails.send({
        from: `EaziWage Support <${SUPPORT_EMAIL}>`,
        to: email,
        subject: "We received your message - EaziWage",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">EaziWage</h1>
              <p style="color: #d1fae5; margin: 5px 0 0; font-size: 14px;">Earned Wage Access for Africa</p>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #111827; margin: 0 0 16px;">Hi ${name},</h2>
              
              <p style="color: #374151; line-height: 1.6; margin: 0 0 16px;">
                Thank you for reaching out to us. We've received your message and our team will get back to you within 24 hours.
              </p>
              
              <div style="background: #f9fafb; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0;">
                <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px; font-weight: 600;">Your Message:</p>
                <p style="color: #111827; margin: 0; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <p style="color: #374151; line-height: 1.6; margin: 24px 0 0;">
                In the meantime, feel free to explore more about how EaziWage is transforming financial wellbeing for Africa's workforce.
              </p>
              
              <p style="color: #374151; line-height: 1.6; margin: 16px 0 0;">
                Best regards,<br>
                <strong>The EaziWage Team</strong>
              </p>
            </div>
            
            <div style="padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                Nairobi, Kenya | +254 723 154900 | support@eaziwage.com
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                © ${new Date().getFullYear()} EaziWage. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send auto-reply:", emailError);
      // Don't fail the request
    }

    return NextResponse.json(
      { 
        message: "Message sent successfully",
        success: true 
      },
      { 
        status: 200,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        }
      }
    );

  } catch (error) {
    console.error("Unexpected error in contact form:", error);
    
    // Don't expose internal errors to the client
    return NextResponse.json(
      { 
        error: "An unexpected error occurred. Please try again later.",
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
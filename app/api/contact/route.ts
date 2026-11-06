import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, bot_field } = body;

    // Honeypot spam check
    if (bot_field) {
      // Bot trapped
      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please provide all required fields: name, email, subject, and message.' },
        { status: 400 }
      );
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    const saved = db.createMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been delivered directly to the Alif Friends 12 editorial desk.',
      id: saved.id,
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    return NextResponse.json(
      { error: 'Failed to process inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

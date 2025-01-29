import { NextResponse, NextRequest } from 'next/server';
import { sendMailAPI } from '@/utils/email';

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json();
    const { name, email, subject, message } = formData;

    sendMailAPI({
      from: email,
      subject: 'Contact Us',
      template: 'Contact Us',
      templateVariables: {
        name,
        from: email,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { message: 'Email Sent Successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to Send Email' },
      { status: 500 },
    );
  }
}

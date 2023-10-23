import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json();
    const { name, email, subject, message } = formData;
    var transport = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_EMAIL_HOST,
      port: Number(process.env.NEXT_PUBLIC_EMAIL_PORT) || 0,
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      },
    });

    const mailOption = {
      from: email,
      to: process.env.NEXT_PUBLIC_EMAIL_TO,
      subject,
      html: `
        <h3> Sender: ${name}</h3>
        <br/>
        <p>${message}</p> 
        `,
    };

    await transport.sendMail(mailOption);

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

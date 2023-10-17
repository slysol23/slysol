import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { name, email, subject, message } = formData;
    console.log(formData);
    var transport = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_EMAIL_HOST,
      port: process.env.NEXT_PUBLIC_EMAIL_PORT,
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      },
    });

    const mailOption = {
      from: email,
      to: process.env.NEXT_PUBLIC_EMAIL_TO,
      subject: 'Contact Form',
      html: `
        <h3> Sender: ${name}</h3>
        <li> Subject: ${subject}</li>
        <li> Message: ${message}</li> 
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

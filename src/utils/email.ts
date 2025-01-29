import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

interface SendEmailSMTP {
  from: string;
  subject: string;
  html: string;
}

export const sendMailSMTP = async ({ from, subject, html }: SendEmailSMTP) => {
  const transport = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_EMAIL_HOST,
    port: Number(process.env.NEXT_PUBLIC_EMAIL_PORT) || 0,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
  });

  const mailOption: Mail.Options = {
    from,
    to: process.env.NEXT_PUBLIC_EMAIL_TO,
    subject,
    html,
  };

  return transport.sendMail(mailOption);
};

interface SendEmailAPI {
  from: string;
  subject: string;
  template?: string;
  templateVariables?: { [key: string]: string };
}

export const sendMailAPI = async ({
  from,
  subject,
  template,
  templateVariables,
}: SendEmailAPI) => {
  const mailgun = new Mailgun(FormData);

  const mg = mailgun.client({
    username: 'api',
    key: process.env.NEXT_PUBLIC_EMAIL_API_KEY || 'API_KEY',
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net/v3"
  });
  const currentYear = new Date().getFullYear();

  try {
    const data = await mg.messages.create(
      (process.env.NEXT_PUBLIC_EMAIL_USER || '').split('@')[1],
      {
        from: `${templateVariables?.name || ''} <${from}>`,
        to: [process.env.NEXT_PUBLIC_EMAIL_TO || ''],
        subject: subject,
        template: template || '',
        'h:X-Mailgun-Variables': JSON.stringify({
          ...templateVariables,
          year: currentYear,
        }),
      },
    );
    console.log(data); // logs response data
  } catch (error) {
    console.log(error); // logs any error
  }
};

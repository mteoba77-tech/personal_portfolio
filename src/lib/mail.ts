import nodemailer from "nodemailer";

export type ContactMessage = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function mailConfigured(): boolean {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env;
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_TO_EMAIL);
}

export async function sendContactEmail(msg: ContactMessage): Promise<void> {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: msg.email,
    subject: `Portfolio contact: ${msg.subject}`,
    text: [
      `Name: ${msg.name}`,
      `Email: ${msg.email}`,
      `Phone: ${msg.phone || "—"}`,
      "",
      msg.message,
    ].join("\n"),
  });
}

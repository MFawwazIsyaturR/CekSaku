import { Env } from "../config/env.config";
import { resend } from "../config/resend.config";

type Params = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
};

const mailer_sender = `CekSaku <${Env.RESEND_MAILER_SENDER}>`;

export const sendEmail = async ({
  to,
  from = mailer_sender,
  subject,
  text,
  html,
}: Params) => {
  return await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    text,
    subject,
    html,
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  username: string,
  token: string
) => {
  const subject = "Kode Reset Kata Sandi CekSaku Anda";
  const text = `Hai ${username},\n\nGunakan kode berikut untuk mereset kata sandi Anda: ${token}\n\nKode ini akan kedaluwarsa dalam 15 menit.\n\nJika Anda tidak meminta ini, abaikan saja email ini.\n`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Reset Kata Sandi CekSaku</h2>
      <p>Hai ${username},</p>
      <p>Gunakan kode di bawah ini untuk mengatur ulang kata sandi Anda. Kode ini hanya berlaku selama 15 menit.</p>
      <div style="background-color: #f2f2f2; padding: 10px 20px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
        <strong>${token}</strong>
      </div>
      <p>Jika Anda tidak meminta reset kata sandi, Anda bisa mengabaikan email ini.</p>
      <p>Terima kasih,<br/>Tim CekSaku</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
};
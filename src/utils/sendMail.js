import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
  host: env('SMTP_SERVER'),
  port: Number(env('SMTP_PORT')),
  auth: {
    user: env('SMTP_LOGIN'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const sendMail = async (message) => {
  return await transporter.sendMail(message);
};

import nodemailer from 'nodemailer';
import { ApiError } from './index.js';

interface Params {
    email: string;
    subject: string;
    text?: string;
    html?: string;
}

const sendEmail = async ({ email, subject, text, html }: Params) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USERNAME,
                pass: process.env.NODEMAILER_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.NODEMAILER_USERNAME,
            to: email,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new ApiError('Error sending email', 500);
    }
};

export { sendEmail };

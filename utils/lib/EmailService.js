/* eslint-disable no-console */
const nodemailer = require('nodemailer');

async function sendEmailVerificationCode(email, verificationCode) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Base Project" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Verify Your Email Address',
            text: `Your verification code is: ${verificationCode}`,
            html: `<p>Your verification code is: <b>${verificationCode}</b></p>`,
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

module.exports = sendEmailVerificationCode;

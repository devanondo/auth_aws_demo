import nodemailer from 'nodemailer';
import config from '../config';

type OptionsType = {
    to: string;
    subject: string;
    html: string;
};

export async function sendEmail(options: OptionsType) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: config.nodemailer_host,
            port: 465,
            secure: true,
            auth: {
                user: config.nodemailer_email,
                pass: config.nodemailer_pass,
            },
        });

        const mailOptions = {
            from: `Night Teer <${config.nodemailer_email}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        throw new Error('Faild to send');
    }
}

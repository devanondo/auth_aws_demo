import nodemailer from 'nodemailer';

type OptionsType = {
    to: string;
    subject: string;
    html: string;
};

export async function sendEmail(options: OptionsType) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.NEXT_PUBLIC_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL,
                pass: process.env.EMAIL_NODEMAILER_PASS,
            },
        });

        const mailOptions = {
            from: `Night Teer <${process.env.NEXT_PUBLIC_EMAIL}>`,
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

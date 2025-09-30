import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (toEmail: any, otp: any) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port:Number(process.env.SMTP_PORT),
        secure:true,
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"GKHRMS" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: 'Your Verification OTP',
        html: `<p>Your OTP is <b>${otp}</b>. It will expire in 30 minutes.</p>`,
    };


    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email not sent');
    }
};

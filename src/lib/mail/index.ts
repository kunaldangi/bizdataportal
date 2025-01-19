import nodemailer, {Transporter} from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


export const transporter: Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_KEY
    },
});

export const send_mail = (mailOptions: Mail.Options) => {
    return new Promise((resolve, reject) => {
        try {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(info);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import { Router } from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import fs from 'fs';
import Hogan from 'hogan.js'
const CLIENT_ID = '1017651201058-16apnm5uulqobtm41bgj79nni780l359.apps.googleusercontent.com'
const CLEINT_SECRET = 'qq-XKkNozVVa28IMWrNi6I_Q'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04IItRcscZcBbCgYIARAAGAQSNwF-L9IrCCCxiWyU3lPrwt2pgVWcWtQxvPB0FLUj1-ySVr_IwLtdNjfys8ciDmFmdawUzCF9VEI'
import { room_details } from './main.mjs';
const router = Router();
export default router;
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
// var template = fs.readFileSync('/template/email', 'utf-8');
// var compiledTemplate = Hogan.compile(template);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
router.get("/email", sendMail);
async function sendMail(email, res) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'nypgoldentv@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const mailOptions = {
            from: 'Golden TV',
            to: "exotaokris365@gmail.com",
            subject: 'Confirmation',
            text: '',
            html: "<h1>This email is to confirm your email address.</h1>",
        };
        const result = await transport.sendMail(mailOptions);
        console.log('Sent email');
        return res.redirect('/auth/login'), result;
    } catch (error) {
        return error;
    }
}
const email = 'nypgoldentv@gmail.com'
sendMail(email)
    .then((result) => console.log('Email sent...', result))
    .catch((error) => console.log(error.message));
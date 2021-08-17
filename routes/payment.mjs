import { Router } from 'express';
import Axios from 'axios';
import FileSys from 'fs';
import Hash from 'hash.js';
import Moment from 'moment';
import { nets_api_key, nets_api_skey, nets_api_gateway } from './payment-config.mjs';
import axios from 'axios';
var Publishable_Key = 'pk_test_51JH64qCNftL7aDDGxbmRaLzvCWayIEyV27af9E3JXthLTjN9kQdPbtZNhPQM7Sp2eKsaQly6wunPsZL0wkwI8Qsu00RrfNYjBl'
var Secret_Key = 'sk_test_51JH64qCNftL7aDDGaAmYV24FR9HK1Mmf7bPTCWP6bFBGPjU8v5pUsEq5CXcp1xpDM3A93kZitOMVtS923oMGZ7qG00FqSWb3S0'
import st from 'stripe';
const stripe = (st)(Secret_Key);
const router = Router();
export default router;
import { ModelRoomInfo } from '../data/roominfo.mjs';
router.get("/generate/:choice/:room_id/:date/:time/:promo", page_generate);
router.post("/generate", nets_generate);
router.post("/query", nets_query);
router.post("/void", nets_void);
import paypal from 'paypal-rest-sdk';
import {Modelpromo} from '../data/promo.mjs'
paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'AfDQ8trJbIo8MYYarbo1e8gic_6JXxq1dDJgh9aQjqnFnwuWjhOQfxW1Klxj8xrj-1hZscpzPLYNa5na',
	'client_secret': 'EApuzibO6KOy6SkEi2HLb0WeNitai8Y5-U3DRyCSFb-ES7zrkoca-kjFfUoCGw6c-ov0F1vYsXk0JjLw'
});
let nets_stan = 0;	//	Counter id for nets, keep this in database
let price = 0;
/**
 * Draws the example page that will create the QR Code
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function page_generate(req, res) {
	const details = await ModelRoomInfo.findByPk(req.params.room_id);
	try {
		let user = req.user.uuid;
		console.log(user);
		if(req.user.role == 'customer'){
		console.log(req.params);
		console.log(req.params.promo);
		let price = 0;
	if (req.params.promo === null) {
		console.log('Promo code is empty');
		price += details.roomprice;
	}
	else {
		const code = await Modelpromo.findOne({
			where: { promo_code: req.params.promo}
		})
		if (code === null) {
			console.log('Promo code is Not found');
			price += details.roomprice;
		}
		else {
			if(code.roomsize == details.roomsize){
				console.log('Promo code is found');
				price += Math.round((100- code.discount)/ 100 * details.roomprice);
				console.log(price);
			}
			else{
				price += details.roomprice;
			}
		}
	}
	let cents = price*100;
		return res.render('user/payment', {cents,choice:req.params.choice, price, details,time:req.params.time,date:req.params.date })
}
		else { return res.render('404');}}
	catch(error){
		return res.render('404');
	};

} 
/**
 * Signs the payload with the secret key
 * @param {{}} payload 
 * @returns {string} Signature
 */
function generate_signature(payload) {
	// 1. signature = json + secret (Concatenate payload and secret)
	const content = JSON.stringify(payload) + nets_api_skey;
	// 2. signature = sha265(signature)SHA-256 Hash 
	// 3. signature = uppercase(signature)Convert to Uppercase 
	const hash = Hash.sha256().update(content).digest('hex').toUpperCase();
	// 4. signature = base64encode(signature)Base64 encode
	return (Buffer.from(hash, 'hex').toString('base64'));
}
/**
 * Generates a NETs QR code to be scanned. With specified price in CENTS
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function nets_generate(req, res) {
	try {
		if (!req.body.amount)
			throw Error("missing required parameter `amount`");
	}
	catch (error) {
		console.error(`Bad request`);
		console.error(error);
		return res.sendStatus(400);
	}

	//	1. Load the constant JSON request 

	try {
		const amount = parseInt(req.body.amount);	//	Assume in cents
		const datetime = new Date();				//	Current date and time

		const payload = JSON.parse(FileSys.readFileSync(`${process.cwd()}/nets/nets-qr-request.json`));
		const stan = ++nets_stan;

		//	Ensures that nets_stat is between 0 ~ 999999
		if (nets_stan >= 1000000)
			nets_stan = 0;

		//console.log(payload);

		//	Just update these stuff
		payload.stan = stan.toString().padStart(6, '0');
		payload.amount = amount;
		payload.npx_data.E201 = amount;

		payload.transaction_date = Moment(datetime).format("MMDD");
		//`${datetime.getMonth().toString().padStart(2, '0')}${datetime.getDay().toString().padStart(2, '0')}`;
		payload.transaction_time = Moment(datetime).format("HHmmss");
		//datetime.toTimeString().split(' ')[0].replace(':', '').replace(':', '');

		//	Sign the payload
		const signature = generate_signature(payload);

		const response = await Axios.post(nets_api_gateway.request, payload, {
			headers: {
				"Content-Type": "application/json",
				"KeyId": nets_api_key,
				"Sign": signature
			}
		});

		if (response.status != 200)
			throw new Error("Failed request to NETs");

		if (response.data.response_code != '00') {
			throw new Error("Failed to request for QR Code");
		}

		console.log(response.data);
		return res.json({
			"txn_identifier": response.data.txn_identifier,
			"amount": response.data.amount,
			"stan": response.data.stan,
			"transaction_date": response.data.transaction_date,
			"transaction_time": response.data.transaction_time,
			"qr_code": response.data.qr_code
		});
	}
	catch (error) {
		console.error(`Failed to generate QR code for payment`);
		console.error(error);
		return res.sendStatus(500);
	}
}

/**
 * Query a created transaction status. Whether its completed or in progress or cancelled
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function nets_query(req, res) {
	try {
		// TODO: Validate your req.body 
	}
	catch (error) {
		console.error(`Bad request`);
		console.error(error);
		return res.sendStatus(400);
	}

	try {
		const payload = JSON.parse(FileSys.readFileSync(`${process.cwd()}/nets/nets-qr-query.json`));

		payload.txn_identifier = req.body.txn_identifier;
		payload.stan = req.body.stan;
		payload.transaction_date = req.body.transaction_date;
		payload.transaction_time = req.body.transaction_time;
		payload.npx_data.E201 = req.body.amount;

		const signature = generate_signature(payload);
		const response = await Axios.post(nets_api_gateway.query, payload, {
			headers: {
				"Content-Type": "application/json",
				"KeyId": nets_api_key,
				"Sign": signature
			}
		});

		if (response.status != 200)
			throw new Error(`Failed to query transaction: ${payload.txn_identifier}`);

		switch (response.data.response_code) {
			//	Pending
			case "09":
				console.log("time Out");
				return res.json({
					status: 0
				});
			//	Okay
			case "00":
				console.log('successfull');
				return res.json({
					status: 1
				});

			//	Failed
			default:
				return res.json({
					status: -1
				});
		}
	}
	catch (error) {
		console.error(`Failed to query transaction`);
		console.error(error);
		return res.sendStatus(500);
	}
}

/**
 * Cancel a specified transaction
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */

async function nets_void(req, res) {
	try {

	}
	catch (error) {
		console.error(`Bad request`);
		console.error(error);
		return res.sendStatus(400);
	}

	try {
		const payload = JSON.parse(FileSys.readFileSync(`${process.cwd()}/nets/nets-qr-void.json`));

		payload.txn_identifier = req.body.txn_identifier;
		payload.stan = req.body.stan;
		payload.transaction_date = req.body.transaction_date;
		payload.transaction_time = req.body.transaction_time;
		payload.amount = req.body.amount;
		// payload.npx_data.E201    = req.body.amount;

		const signature = generate_signature(payload);
		const response = await Axios.post(nets_api_gateway.void, payload, {
			headers: {
				"Content-Type": "application/json",
				"KeyId": nets_api_key,
				"Sign": signature
			}
		});

		if (response.status != 200)
			throw new Error(`Failed to query transaction: ${payload.txn_identifier}`);

		console.log(response.data);

		switch (response.data.response_code) {
			//	Okay
			case "00":
				return res.json({
					status: 1
				});
			case "68":
				return res.json({
					status: 0
				});
			//	Skip?
			default:
		}
		
	}
	catch (error) {
		console.error(`Failed to void transaction`);
		console.error(error);
		return res.sendStatus(500);
	}
}
router.post('/paypal/:choice/:room_id/:date/:time', (req, res) => {
	const time = req.params.time;
	console.log(time);
	const create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://localhost:3000/payment/paypal/success/" + req.params.choice + "/" + req.body.amount + "/" + req.params.room_id + "/" + req.params.date +"/" +time.split(' ') ,
			"cancel_url": "http://localhost:3000/payment/cancel"
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": "Golden Tv",
					"price": req.body.amount,
					"currency": "SGD",
					"quantity": 1
				}]
			},
			"amount": {
				"currency": "SGD",
				"total": req.body.amount
			},
			"description": "Golden TV"
		}]
	};

	paypal.payment.create(create_payment_json, function (error, payment) {
		if (error) {
			throw error;
		} else {
			for (let i = 0; i < payment.links.length; i++) {
				if (payment.links[i].rel === 'approval_url') {
					res.redirect(payment.links[i].href);
				}
			}
		}
	});

});

router.get('/paypal/success/:choice/:price/:room_id/:date/:time', (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;

	const execute_payment_json = {
		"payer_id": payerId,
		"transactions": [{
			"amount": {
				"currency": "SGD",
				"total": req.params.price
			}
		}]
	};
	var x = req.params.time;
	// const time = x.substring(0, 3) + " " + x.substring(3,6 ) + " " + x.substring(6, x.length);
	const time = x.replaceAll(',', " ");
	console.log(time);
	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
		if (error) {
			console.log(error.response);
			throw error;
		} else {
			console.log(JSON.stringify(payment));
			res.redirect('/payment/success/' + req.params.choice+ "/" + req.params.price + "/" + req.params.room_id + "/" + req.params.date + "/" +time);
		}
	});
});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { connect } from 'http2';
import { time } from 'console';
import { Modelticket } from '../data/tickets.mjs';
const CLIENT_ID = '606882834321-g960n5vid466qrmtpcrvno3n8mm97ui0.apps.googleusercontent.com';
const CLEINT_SECRET = 'K8h_BPNEEODlMANw1uueD0IM';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04oD9XpKmvyYOCgYIARAAGAQSNwF-L9IruXKPRKKl1dnfMJGZRXlccxmQxub8JabPtXvr3Hs4SfH-vEMUq20VQwH5A6sGzLEPHkk';
const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLEINT_SECRET,
	REDIRECT_URI
);
import date from 'date-and-time';
const now = new Date();
const DateNow = date.format(now, 'DD/MM/YYYY');
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
router.get("/success/:choice/:price/:room_id/:date/:time",async function (req, res, next) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'customer') {
	console.log("ticket page accessed");
	const room = await ModelRoomInfo.findOne({
			where: {
			room_uuid: req.params.room_id
			}
		});
		const ticket = await Modelticket.create({ 
			user_id:req.user.uuid,
			room_id: req.params.room_id,
			choice: req.params.choice,
			date: req.params.date,
			time: req.params.time,
			price:req.params.price
		});
		console.log(ticket);
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
		from: 'Golden TV ',
		to: req.user.email,
		subject: 'Booking Details',
			html: `<style>
    /* -------------------------------------
    GLOBAL
    A very basic CSS reset
------------------------------------- */
* {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
    box-sizing: border-box;
    font-size: 14px;
}

img {
    max-width: 100%;
}

body {
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: none;
    width: 100% !important;
    height: 100%;
    line-height: 1.6;
}

/* Let's make sure all tables have defaults */
table td {
    vertical-align: top;
}

/* -------------------------------------
    BODY & CONTAINER
------------------------------------- */
body {
    background-color: #f6f6f6;
}

.body-wrap {
    background-color: #f6f6f6;
    width: 100%;
}

.container {
    display: block !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    /* makes it centered */
    clear: both !important;
}

.content {
    max-width: 600px;
    margin: 0 auto;
    display: block;
    padding: 20px;
}

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
}

.content-wrap {
    padding: 20px;
}

.content-block {
    padding: 0 0 20px;
}

.header {
    width: 100%;
    margin-bottom: 20px;
}

.footer {
    width: 100%;
    clear: both;
    color: #999;
    padding: 20px;
}
.footer a {
    color: #999;
}
.footer p, .footer a, .footer unsubscribe, .footer td {
    font-size: 12px;
}

/* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
h1, h2, h3 {
    font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    color: #000;
    margin: 40px 0 0;
    line-height: 1.2;
    font-weight: 400;
}

h1 {
    font-size: 32px;
    font-weight: 500;
}

h2 {
    font-size: 24px;
}

h3 {
    font-size: 18px;
}

h4 {
    font-size: 14px;
    font-weight: 600;
}

p, ul, ol {
    margin-bottom: 10px;
    font-weight: normal;
}
p li, ul li, ol li {
    margin-left: 5px;
    list-style-position: inside;
}

/* -------------------------------------
    LINKS & BUTTONS
------------------------------------- */
a {
    color: #1ab394;
    text-decoration: underline;
}

.btn-primary {
    text-decoration: none;
    color: #FFF;
    background-color: #1ab394;
    border: solid #1ab394;
    border-width: 5px 10px;
    line-height: 2;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    display: inline-block;
    border-radius: 5px;
    text-transform: capitalize;
}

/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
    margin-bottom: 0;
}

.first {
    margin-top: 0;
}

.aligncenter {
    text-align: center;
}

.alignright {
    text-align: right;
}

.alignleft {
    text-align: left;
}

.clear {
    clear: both;
}

/* -------------------------------------
    ALERTS
    Change the class depending on warning email, good email or bad email
------------------------------------- */
.alert {
    font-size: 16px;
    color: #fff;
    font-weight: 500;
    padding: 20px;
    text-align: center;
    border-radius: 3px 3px 0 0;
}
.alert a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
}
.alert.alert-warning {
    background: #f8ac59;
}
.alert.alert-bad {
    background: #ed5565;
}
.alert.alert-good {
    background: #1ab394;
}

/* -------------------------------------
    INVOICE
    Styles for the billing table
------------------------------------- */
.invoice {
    margin: 40px auto;
    text-align: left;
    width: 80%;
}
.invoice td {
    padding: 5px 0;
}
.invoice .invoice-items {
    width: 100%;
}
.invoice .invoice-items td {
    border-top: #eee 1px solid;
}
.invoice .invoice-items .total td {
    border-top: 2px solid #333;
    border-bottom: 2px solid #333;
    font-weight: 700;
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 640px) {
    h1, h2, h3, h4 {
        font-weight: 600 !important;
        margin: 20px 0 5px !important;
    }

    h1 {
        font-size: 22px !important;
    }

    h2 {
        font-size: 18px !important;
    }

    h3 {
        font-size: 16px !important;
    }

    .container {
        width: 100% !important;
    }

    .content, .content-wrap {
        padding: 10px !important;
    }

    .invoice {
        width: 100% !important;
    }
}
</style>
<table class="body-wrap">
    <tbody>
        <tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td class="content-wrap aligncenter">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td class="content-block">
                                                    <h2>Thanks for using Golden TV</h2>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="content-block">
                                                    <table class="invoice">
                                                        <tbody>
                                                            <tr>
                                                                <td> Hello, ${req.user.name}<br>Booking Details<br>${DateNow}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <table class="invoice-items" cellpadding="0"
                                                                        cellspacing="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>Choice</td>
                                                                                <td class="alignright">${req.params.choice}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Location</td>
                                                                                <td class="alignright">${room.location}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Date</td>
                                                                                <td class="alignright">${req.params.date}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Time Slot</td>
                                                                                <td class="alignright">${req.params.time}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Room Size</td>
                                                                                <td class="alignright">${room.roomsize}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Room Name</td>
                                                                                <td class="alignright">${room.roomname}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Price</td>
                                                                                <td class="alignright">$ ${req.params.price}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="content-block">
                                                    Present this email or the ticket which you can access on our website!

                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="content-block">
                                                                <ul>
                                                                    <li> Please note that all completed and confirmed transactions <bold> CANNOT BE CANCELLED OR REFUNDED</bold> under
                                                                        any circumstances.</li>
                                                                    <li>Please arrive 15mins in advance to purchase pop-corn.</li>
                                                                    <li>Please note that <bold>PROOF OF AGE is required for NC16, M18 & R21 films </bold> during entry into the cinema.
                                                                        Please produce valid identity document that displays your photograph and date of birth as proof of age when
                                                                        requested. The Management reserves the right to verify the age of any patron and/or deny any patron from
                                                                        purchasing and/or collecting tickets and/or entry into the cinema if they are not able to produce a proper or
                                                                        valid identity document as proof of age or do not meet the minimum qualifying age based on the relevant film
                                                                        rating. Tickets purchased in such cases are <bold>NOT EXCHANGEABLE OR REFUNDABLE </bold> under any
                                                                        circumstances.</li>
                                                                    <li> For Answers to Your questions, Please contact us through our email nypgoldentv@gmail.com. Please note that all
                                                                        emails will be replied to within three working day.</li>
                                                                </ul>

                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="content-block">
                                                    <a href="http://localhost:3000">View in browser</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="content-block">
                                                Golden TV Ltd,
                                                Suntec City Mall,
                                                Singapore 038983
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="footer">
                        <table width="100%">
                            <tbody>
                                <tr>
                                    <td class="aligncenter content-block">Questions? Email <a
                                            href="mailto:">nypgoldentv@gmail.com</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </td>
            <td></td>
        </tr>
    </tbody>
</table>
`	};
	const result = await transport.sendMail(mailOptions);
	console.log('Sent email..');
	console.log('Payment is succeed')
	return res.render('success', { choice:req.params.choice, time:req.params.time, date:req.params.date,room, price:req.params.price
	});
		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
});
router.get("/cancel", (req, res) => {
	console.log("Payment is Cancalled");
	return res.render('cancel', {
	});
});
router.get("/timeout", (req, res) => {
	console.log("Time Out");
	return res.render('timeout', {
	});
});
router.post('/card/:choice/:price/:room_id/:date/:time', (req, res) => {
	const amount = req.body.amount;
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken
	})
		.then(customer => stripe.charges.create({
			amount,
			description: 'Bought a room',
			currency: 'SGD',
			customer: customer.id
		}))
		.then(charge => res.redirect('/payment/success/' + req.params.choice + "/"+ req.params.price+"/" + req.params.room_id + "/" + req.params.date + "/" +req.params.time));
});

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
router.get("/generate/:choice/:room_id/:date/:time", page_generate);
router.post("/generate", nets_generate);
router.post("/query", nets_query);
router.post("/void", nets_void);
import paypal from 'paypal-rest-sdk'
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
	// try {
		// let user = req.user.uuid;
		return res.render('user/payment', {choice:req.params.choice, details,time:req.params.time,date:req.params.date })
	// catch(error){
	// 	return res.render('404');
	// };

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
			"return_url": "http://localhost:3000/payment/paypal/success/" + req.params.choice + "/" + req.body.amount + "/" + req.params.room_id + "/" + req.params.date +"/" +time.split(' ')  ,
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
			res.redirect('/payment/success/' + req.params.choice + "/" + req.params.room_id + "/" + req.params.date + "/" +time);
		}
	});
});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { connect } from 'http2';
import { time } from 'console';
import { Modelticket } from '../data/tickets.mjs';
const CLIENT_ID = '606882834321-g960n5vid466qrmtpcrvno3n8mm97ui0.apps.googleusercontent.com'
const CLEINT_SECRET = 'ddcxoBS7eD1MK4iMlqSHItvq'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04kNCsE6pIn8-CgYIARAAGAQSNwF-L9Ir4cYR9uueroLFBr7H2IPRf_f7M00FGbkFTpOmQvKkDdbSvEiqyr_2kEZa5lkRSXG7yr4'
const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLEINT_SECRET,
	REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
router.get("/success/:choice/:room_id/:date/:time",async function (req, res, next) {
	console.log("ticket page accessed");
	const room = await ModelRoomInfo.findOne({
			where: {
			room_uuid: req.params.room_id
			}
		});
		const string_date = req.params.date;
		const ticket = await Modelticket.create({ 
			user_id:req.user.uuid,
			room_id: req.params.room_id,
			choice: req.params.choice,
			date: req.params.date,
			time: req.params.time
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
		from: 'Golden TV <no-reply>',
		to: req.user.email,
		subject: 'Booking Confirmation',
		html: "<h1>Golden Tv Room Booking Confirmation</h1>"+
		    "<h2>Hello "+req.user.name+"</h2>"+
			"<h3>---Room details---</h3>"+
			"<h4>Choice: " +req.params.choice+"</h4>"+
			"<h4>Location: " + room.location + "</h4>" +
			"<h4>Date: " + req.params.date + "</h4>" +
			"<h4>Time Slot: " + req.params.time + "</h4>"+
			"<h4>Room Size: " + room.roomsize + "</h4>" +
			"<h4>Room Name" + room.roomname + "</h4>" +
			"<h4>Price: $" + room.roomprice + "</h4>"+
			'<h3>Present this email or the ticket which you can access on our website during entry!</h3>' +
			"<ul><li> Please note that all completed and confirmed transactions <bold> CANNOT BE CANCELLED OR REFUNDED</bold> under any circumstances.</li><li>Please arrive 15mins in advance to purchase pop-corn</li>"+
			"<li>Please note that <bold>PROOF OF AGE is required for NC16, M18 & R21 films </bold> during entry into the cinema. Please produce valid identity document that displays your photograph and date of birth as proof of age when requested. The Management reserves the right to verify the age of any patron and/or deny any patron from purchasing and/or collecting tickets and/or entry into the cinema if they are not able to produce a proper or valid identity document as proof of age or do not meet the minimum qualifying age based on the relevant film rating. Tickets purchased in such cases are <bold>NOT EXCHANGEABLE OR REFUNDABLE </bold> under any circumstances.</li>"+
			"<li> For Answers to Your questions, Please contact us through our email nypgoldentv@gmail.com. Please note that all emails will be replied to within three working day.</li></ul>"+
			"<h2>Thank You For Choosing Golden Tv. We look forward to serve you!</h2>",
	};
	const result = await transport.sendMail(mailOptions);
	console.log('Sent email..');
	console.log('Payment is succeed')
	return res.render('success', { choice:req.params.choice, time:req.params.time, date:req.params.date,room
	});
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
router.post('/card/:choice/:room_id/:date/:time', (req, res) => {
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
		.then(charge => res.redirect('/payment/success/' + req.params.choice + "/" + req.params.room_id + "/" + req.params.date + "/" +req.params.time));
});

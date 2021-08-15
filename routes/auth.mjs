import { Router } from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
import { ModelUser } from '../data/user.mjs';
import Hash from 'hash.js';
import session from 'express-session';
import mysql from 'mysql';
import Passport from 'passport';
import ExpressHBS from 'express-handlebars';
const hbsRender = ExpressHBS.create({});
import JWT from 'jsonwebtoken';
const router = Router();
export default router;

/**
 * Regular expressions for form testing
 **/
const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



router.get("/login", login_page);
router.post("/login", login_process);
router.get("/register", register_page);
router.post("/register", register_process);
router.get("/verify/:token", verify_process);
router.get("/profile", profile_page);
router.get('/add/user', user);
router.post("/add/user", user_process);
/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function login_page(req, res) {
	console.log("Login page accessed");
	return res.render('auth/login');
}

/**
 * Render the registration page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function register_page(req, res) {
	console.log("Register page accessed");
	return res.render('auth/register');
}
async function user (req, res){
	console.log("new users");
	return res.render("auth/add_users");
}
async function user_process(req, res){
	console.log("adding new staff")
		const user = await ModelUser.create({
			email: req.body.email,
			password: Hash.sha256().update(req.body.password).digest("hex"),
			name: req.body.name,
			role: req.body.role
		});
		return res.redirect("/counter/users");
}
async function login_process(req, res, next) {
	console.log("login contents received");
	console.log(req.body);

	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	try {
		if (!regexEmail.test(req.body.email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		// else {
		// 	const user = await ModelUser.findOne({ where: { email: req.body.email } });
		// 	if (user.verified == false) {
		// 		errors = errors.concat({ text: "The Email is Not verified. Please verifiy it! Please Check You email to verify!" });
		// 	}
		// 	await send_verification(user.uuid, user.email);
		// }

		if (!regexPwd.test(req.body.password)) {
			errors = errors.concat({ text: "Password Requires minimum 8 characters, at least 1 Uppercase letter, 1 Lowercase Letter, 1 number and 1 Special Character!" });
		}

		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/login', { errors: errors });
	}

	return Passport.authenticate('local', {
		successRedirect: "/home",
		failureRedirect: "/auth/login",
		failureFlash: true
	})(req, res, next);
}
/**
 * Process the registration form body
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function register_process(req, res) {
	console.log("Register contents received");
	console.log(req.body);
	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	try {
		if (!regexName.test(req.body.name)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}

		if (!regexEmail.test(req.body.email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const user = await ModelUser.findOne({ where: { email: req.body.email } });
			if (user != null) {
				errors = errors.concat({ text: "This email cannot be used!" });
			}
		}

		if (!regexPwd.test(req.body.password)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one symbol!" });
		}
		else if (req.body.password !== req.body.password2) {
			errors = errors.concat({ text: "Password do not match!" });
		}

		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the registration form body.");
		console.error(error);
		return res.render('auth/register', { errors: errors });
	}

	//	Create new user, now that all the test above passed
	try {
		const user = await ModelUser.create({
			email: req.body.email,
			password: Hash.sha256().update(req.body.password).digest("hex"),
			name: req.body.name,
		});
		await send_verification(user.uuid, user.email, user.name);
		flashMessage(res, 'success', 'Successfully created an account. Please verify your email and login', 'fas fa-sign-in-alt', true);
		return res.redirect("/auth/login");

	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${req.body.email} `);
		console.error(error);
		return res.status(500).end();
	}
};
const CLIENT_ID = '606882834321-g960n5vid466qrmtpcrvno3n8mm97ui0.apps.googleusercontent.com'
const CLEINT_SECRET = 'ddcxoBS7eD1MK4iMlqSHItvq'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04kNCsE6pIn8-CgYIARAAGAQSNwF-L9Ir4cYR9uueroLFBr7H2IPRf_f7M00FGbkFTpOmQvKkDdbSvEiqyr_2kEZa5lkRSXG7yr4'
const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLEINT_SECRET,
	REDIRECT_URI
);
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function send_verification(uid, email, name) {
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
	const token = JWT.sign({
		uuid: uid
	}, 'the-key', {
		// expire in 5mins
		expiresIn: '300000'
	});

	//	Send email using google
	return transport.sendMail({
		to: email,
		from: 'Golden Tv',
		subject: `Verify your email`,
		html: `<img id="imgborder" class="logo" style="width: 85px;" src="https://micdn-13a1c.kxcdn.com/images/sg/content-images/movie_cinemaxx_rebands_to_cinepolis.jpg">
		<hr>
		 <h1>Hello, ${name}</h1>
        <h5 class="text-muted mb-2">
		Thank you for
        choosing Golden Tv, to make
        full use of our
        features,
        verify your email address.
        Please verify in 5min!
        </h5>
        <a href="http://localhost:3000/auth/verify/${token}"><button type="button" class="btn btn-dark">Verify Your Email</button></a>
		<br>
		<br>
		Or, copy and paste the following URL into your browser:
		<a href="http://localhost:3000/auth/verify/${token}">http://localhost:3000/auth/verify/${token}</a>
		`
		// await hbsRender.render(`${process.cwd()}/templates/layouts/email-verify.handlebars`, {
		// 	token: token
		// })
	});
}
async function verify_process(req, res) {
	const token = req.params.token;
	let uuid = null;
	try {
		const payload = JWT.verify(token, 'the-key');
		uuid = payload.uuid;
	}
	catch (error) {
		console.error(`The token is invalid`);
		console.error(error);
		return res.sendStatus(400).end();
	}

	try {
		const user = await ModelUser.findByPk(uuid);
		const update = await ModelUser.update({
			verified: true
		}, {
			where: {
				uuid:uuid
			}
		});
		// user.verify()
		user.save();
		return res.render("auth/verified", {
			name: user.name
		});
	}
	catch (error) {
		console.error(`Failed to locate ${uuid}`);
		console.error(error);
		return res.sendStatus(500).end();
	}
}


async function profile_page(req, res) {
	if (req.sessionID) {
		console.log("Profile page accessed");
		return res.render('auth/profile', {
			username: con.connect(function (err) {
				if (err) throw err;
				con.query("SELECT name FROM users WHERE uuid == '6360b1b5-1abf-489d-85f1-9312c319081f'", function (err, result) {
					if (err) throw err;
					return result;
				});
			}),
			email: con.connect(function (err) {
				if (err) throw err;
				con.query("SELECT email FROM users WHERE uuid == '6360b1b5-1abf-489d-85f1-9312c319081f'", function (err, result) {
					if (err) throw err;
					return result;
				});
			})
		})
	}
	else {
		console.log("Please login first.")
		return res.render('auth/login');
	}
};
router.get("/logout", async function (req, res) {
	req.session.destroy((err) => {
		if (err) {
			return console.log(err);
		}
		res.redirect("/home");
	});
});
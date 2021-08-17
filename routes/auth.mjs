import { Router } from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
import { ModelUser } from '../data/user.mjs';
import { upload } from '../utils/multer.mjs';
import Hash from 'hash.js';
import session from 'express-session';
import mysql from 'mysql';
import Passport from 'passport';
import ExpressHBS from 'express-handlebars';
const hbsRender = ExpressHBS.create({});
import JWT from 'jsonwebtoken';
import fs from 'fs';
const router = Router();
export default router;

/**
 * Regular expressions for  testing
 **/
const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const JWT_SECRET = "Super_Secret";

router.get("/login", login_page);
router.post("/login", login_process);
router.get("/register", register_page);
router.post("/register", register_process);
router.get("/verify/:token", verify_process);
router.get("/profile", profile_page);
router.post("/profile", profile_process);
router.get("/updateprofile", updateprofile_page);
router.put("/updateprofile/:uuid", updateprofile_processs);
router.get("/deleteuser/:uuid", deleteuser);
router.get('/add/user', user);
router.post("/add/user", user_process);
/**
 * 
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
router.get("/forgot-password", (req, res, next)=> {
	console.log("Forgot password page accessed.");
	return res.render('auth/forgot-password');
});
router.post("/forgot-password", async function (req, res, next){
	let errors = [];
	try{
	if (!regexEmail.test(req.body.email)) {
		errors = errors.concat({ text: "Invalid email address!" });
	}
	else {
		const user = await ModelUser.findOne({ where: { email: req.body.email } });
		if (user === null) {
			errors = errors.concat({ text: "This email is not registered!" });
			return res.render('auth/forgot-password', { errors: errors });
		}
	}}
	catch (error) {
		console.error("There is errors with the forgot form body.");
		console.error(error);
		return res.render('auth/forgot-password', { errors: errors });
	}
	try{
	const user = await ModelUser.findOne({ where: { email: req.body.email } });
	// const payload = {
	// 	email: user.email,
	// 	id: user.uuid
	// }
	await send_resetlink(user.name, user.email, user.uuid);
	flashMessage(res, 'success', 'Successfully Sent Password reset link to your email. Please It!', 'fas fa-sign-in-alt', true);
	return res.redirect("/auth/login");}
		catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${req.body.email} `);
		console.error(error);
		return res.status(500).end();
	}

});
router.get("/reset-password/:token", async function (req, res, next){
	const token = req.params.token;
	console.log('password reseting page accesed')
	let uuid = null;
	let errors = [];
	try {
		const payload = JWT.verify(token, 'the-key');
		uuid = payload.uuid;
		console.log(uuid);
	}
	catch (error) {
		console.error(`The token is invalid`);
		console.error(error);
		return res.sendStatus(400).end();
	}
	try{
		const user = await ModelUser.findByPk(uuid);
		console.log(user);
		return res.render('auth/reset-password', {email: user.email, user})
	}
	catch(error){
		console.log(error);
	}
});
router.post("/reset-password/:id", async function (req, res, next){
	const id = req.params.id;
	const {password, password2} = req.body;
	const user = await ModelUser.findByPk(id);
	try{
		if (!regexPwd.test(req.body.password)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one symbol!" });
		}
		else if (req.body.password !== req.body.password2) {
			errors = errors.concat({ text: "Password do not match!" });
		}}
	catch (error) {
			console.error("There is errors with the reset password form.");
			console.error(error);
			return res.render('/', { errors: errors });
		}
		try{
			const user = await ModelUser.findByPk(id);
			const update = await ModelUser.update({
				password: Hash.sha256().update(req.body.password).digest("hex")
			}, {
				where: {
					uuid: id
				}
			});
			user.save();
			if (req.session){
				req.session.destroy();
			}
			flashMessage(res, 'success', 'Successfully changed password. ', 'fas fa-sign-in-alt', true);
		return res.render('auth/login', )
	}catch(error){
		console.log(error);
	}
});
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
// access by manager only
async function user (req, res){
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager') {
	console.log("new users");
	return res.render("auth/add_users");
		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
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
			errors = errors.concat({ text: "Email or Password is incorrect." });
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
// google api
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
import { uuid } from 'uuidv4';
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function send_resetlink(name,email,id){
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
		uuid: id
	}, 'the-key', {
		// expire in 5mins
		expiresIn: '300000'
	});
	console.log("Password email reset link sent ready...")
	return transport.sendMail({
		to: email,
		from: 'Golden Tv',
		subject: `Reset Password`,
		html: `
		<hr>

<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="http://localhost:3000/" title="logo" target="_blank">
                            <img id="imgborder" class="logo" style="width: 85px;" src="https://micdn-13a1c.kxcdn.com/images/sg/content-images/movie_cinemaxx_rebands_to_cinepolis.jpg">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Hello Saran, You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="http://localhost:3000/auth/reset-password/${token}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>Golden TV</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>
		`
	});
}

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

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */

async function profile_page(req, res) {
		const tid = String(req.user.uuid);
		const user = await ModelUser.findByPk(tid);
		console.log("Profile page accessed");
		return res.render('auth/profile',
			{ user: user }
		);
	};

async function profile_process(req, res){
	try{
		const tid = String(req.user.uuid);
		const user = await ModelUser.findByPk(tid);
		user.update({
			"name":req.user.name,
			"email":req.user.email
		});
		user.save();
		return res.redirect("/auth/profile");
	}
	catch(error){
		console.error(`Failed to update user ${req.body.user.name}`);
	}


}
async function updateprofile_page(req, res){
	const tid = String(req.user.uuid);
	const user = await ModelUser.findByPk(tid);
	console.log("Update Profile page accessed");
	return res.render("auth/updateprofile",
			{ user: user }
		);
}

async function updateprofile_processs(req, res){
	try{
		let update_image = {};
		const tid = String(req.user.uuid);
		const user = await ModelUser.findByPk(tid);
		const profilepic = './public/uploads/' + user['profilepic'];
		if (req.file != null && typeof req.file == 'object') {
			if (Object.keys(req.file).length != 0) { //select file
				fs.unlink(profilepic, function (err) {
					if (err) {
						throw err
					} else {
						console.log("Successfully deleted the file.")
					}
				})
				update_image.image = req.file.filename;
			}
			else {
				update_image.image = user.profilepic; //select NO file
			}
		}
		user.update({
			"name":req.body.name,
			"email":req.body.email,
			"profilepic":update_image.image
		});
		user.save();
		return res.redirect("/auth/profile");
	}
	catch(error){
		console.error(`Failed to update user ${req.body.user.name}`);
	}


}
/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
 async function deleteuser(req, res, next) {
	try {
		const tid = String(req.user.uuid);
		const target = await ModelUser.findByPk(tid);
		const profilepic = './public/uploads/' + target['profilepic'];
		fs.unlink(profilepic, function (err) {
			if (err) {
				throw err
			} else {
				console.log("Successfully deleted the file.")
			}
		})
		req.session.destroy((err) => {
			if (err) {
				return console.log(err);
			}
		})
		target.destroy();
		console.log(`Deleted user: ${tid}`);
		return res.redirect("/home");
	}
	catch (error) {
		console.error(`Failed to delete`)
		error.code = (error.code) ? error.code : 500;
		return next(error);
	}
}


router.get("/logout", async function (req, res) {
	req.session.destroy((err) => {
		if (err) {
			return console.log(err);
		}
		res.redirect("/home");
	});
});
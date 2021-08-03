import { Router } from 'express';
import { Op } from '../data/database.mjs';
import { flashMessage } from '../utils/flashmsg.mjs'
// import { UploadFile, UploadTo, DeleteFile, DeleteFilePath } from '../utils/multer.mjs';
// import axios from 'axios';
import Review from '../routes/user/review.mjs';
// import Passport from 'passport';
import path from 'path';
import fs from 'fs';
import express from 'express';
import methodOverride from 'method-override';
import payment from '../routes/payment.mjs';
import { ModelReview } from '../data/review.mjs';
// import {ModelRoomReview} from '../data/roomreview.mjs';
import RouterReview from './user/review.mjs';
import Routerfaq from './admin/faq.mjs';
// import RouterRoomReview from './roomreview.mjs';
// const exphbs = require('express-handlebars');
const router = Router();
export default router;

import Admin from '../routes/admin/admin.js';
import HomeInfo from '../routes/admin/homeinfo.js';
import Prodlist from '../routes/admin/prodlist.js';
import MovieInfo from '../routes/admin/movieinfo.js';
import SongInfo from '../routes/admin/songinfo.js';
import User from '../routes/user/user.js';
import ticket from '../routes/user/ticket.mjs';

// router.use("/sendemail", Email);
router.use("/admin", Admin);
router.use("/", HomeInfo);
router.use("/prod", Prodlist);
router.use("/movie", MovieInfo);
router.use("/song", SongInfo);
router.use('/user', User);
router.use('/ticket', ticket);
router.use("/payment", payment);
router.get("/paymentOption", async function (req, res) {
	console.log("Choosing payment method");
	return res.render('user/PaymentOption');
});
// router.get("*", notfound_page);
// function notfound_page(req, res) {
// 	console.log("Home page accessed");
// 	return res.render('404');
// }
/**
 * @param database {ORM.Sequelize}
 */
export function initialize_models(database) {
	try {
		console.log("Intitializing ORM models");
		//	Initialzie models
		ModelUser.initialize(database);
		ModelHomeInfo.initialize(database);
		ModelRoomInfo.initialize(database);
		ModelMovies.initialize(database);
		ModelSongInfo.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc

		console.log("Adding intitialization hooks");
		//	Run once hooks during initialization 
		database.addHook("afterBulkSync", generate_root_account.name, generate_root_account.bind(this, database));
		database.addHook("afterBulkSync", generate_homeinfo.email, generate_homeinfo.bind(this, database));
		database.addHook("afterBulkSync", generate_rooms.email, generate_rooms.bind(this, database));
		database.addHook("afterBulkSync", generate_movies.email, generate_movies.bind(this, database));
		database.addHook("afterBulkSync", generate_songs.email, generate_songs.bind(this, database));
	}
	catch (error) {
		console.error("Failed to configure ORM models");
		console.error(error);
	}
}

// ---------------- 
//	TODO: Attach additional routers here
import RouterAuth from './auth.mjs'
router.use("/auth", RouterAuth);

// // Body parser middleware to parse HTTP body to read post data
// router.use(bodyParser.urlencoded({extended: false}));
// router.use(bodyParser.json());

// const ensureAuthenticated = require('../helpers/auth');

// Creates static folder for publicly accessible HTML, CSS and Javascript files
router.use(express.static(path.join(process.cwd(), 'public')));

router.use(methodOverride('_method'));

// router.get ("/axios-test",  example_axios);

class UserRole {
	static get Admin() { return "admin"; }
	static get User()  { return "user";  }
}
// router.use(ensure_auth);
// router.use(ensure_admin);

/**
 * Ensure that all routes in this router can be used only by admin role
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
 async function ensure_auth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);
    }
    else {
        return next();
    }
}
function roleResult(role) {
	if (role == 'admin') { // if it is admin, return true
		var user = false;
		var admin = true;
	}
	else if (role == 'customer') {
		// if it is user, return true
		var user = true;
		var admin = false;
	}
	return [user, admin];
}
router.get("/login", async function (req, res) {
	console.log("Home page accessed after logging in");
	// After login
	// if role column of ModelUser is customer
	console.log(req.user.role);
	// cannot have document bla
	// accessing the role column of the users table
	if (req.user.role == 'customer') {
		return res.redirect('/home');
	}
	else if (req.user.role == 'admin') {
		return res.redirect('/home');
	}
});

// router.get ("/axios-test",  example_axios);

// /**
//  * Example of making a http request
//  * Request (External) -> Data (IN Server) -> Post Processing -> Data (OUT Server, aka response) -> Used somewhere else (Your button, 3rd party RSS???)
//  * Store limited access tokens without exposing credentials.
//  * @param {import('express').Request}  req 
//  * @param {import('express').Response} res 
//  */
//  async function example_axios(req, res) {
// 	axios({
// 		url:    "https://developers.onemap.sg/privateapi/auth/post/getToken",
// 		method: "POST",
// 		data:   {
// 			"email":    "root@mail.com",
// 			"password": ""
// 		}
// 	}).then(function (response) {
// 		console.log(response.data);
// 		return res.json(response.data);
// 	});
// }

// const expressJson = express.json(); 
// const bodyParser  = express.urlencoded({extended: true}); 
// router.use([expressJson, bodyParser]);


// /**
//  * Renders the edithomebestreleases page
//  * @param {Request}  req Express Request handle
//  * @param {Response} res Express Response handle
//  */
// // ---------------- 
// //	TODO:	Common URL paths here
// async function editmovie_page(req, res) {
// 	console.log("Prod List Edit Movie page accessed");
// 	return res.render('updatemovies', {

// 	});
// };

router.get("/about", async function (req, res) {
	console.log("About page accessed");
	return res.render('about', {
		author: "The awesome programmer",
		values: [1, 2, 3, 4, 5, 6]
	});
});

router.get('/about', (req, res) => {
	const author = 'Denzel Washington';
	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';
	res.render('about', {
		author: author,
		success_msg: success_msg,
		error_msg: error_msg
	})
});

router.get("/businessstatistics", businessstatistics_page);

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function businessstatistics_page (req, res) {
	console.log("Business Statistics page accessed");
	return res.render('businessstatistics', {
		
	});
};
router.get("/contactus", function (req, res) {
	console.log("Contact Us page accessed");
	return res.render("user/contactus", {

	});
});
router.get("/testing", function (req, res){
	return res.render("admin/Counter")
})


import { Router } from 'express';
import { Op } from '../data/database.mjs';
import { flashMessage } from '../utils/flashmsg.mjs'
import Review from '../routes/user/review.mjs';
import path from 'path';
import fs from 'fs';
import ORM from "sequelize";
import express from 'express';
import methodOverride from 'method-override';
import payment from '../routes/payment.mjs';
import { ModelReview } from '../data/review.mjs';
import { ModelUser } from '../data/user.mjs';
import { ModelHomeInfo } from '../data/homeinfo.mjs';
import { ModelMovieInfo } from '../data/movieinfo.mjs';
import RouterReview from './user/review.mjs';
import Routerfaq from './admin/faq.mjs';
import fileUpload from 'express-fileupload';
import Routerchatbot from './user/chatbot.js';
// import RouterRoomReview from './roomreview.mjs';
// const exphbs = require('express-handlebars');
const router = Router();
export default router;

import Admin from '../routes/admin/admin.js';
import HomeInfo from '../routes/admin/homeinfo.js';
import Prodlist from '../routes/admin/prodlist.js';
import MovieInfo from '../routes/admin/movieinfo.js';
import SongInfo from '../routes/admin/songinfo.js';
import RoomInfo from '../routes/admin/roominfo.js';
import User from '../routes/user/user.js';
import ticket from '../routes/user/ticket.mjs';
import counter from './admin/counter.js';
import { upload } from '../utils/multer.mjs';
import review from '../routes/user/review.mjs';
// router.use("/sendemail", Email);
// router.use(fileUpload());
router.use("/review", review);
router.use("/faq", Routerfaq);
router.use("/admin", Admin);
//All
router.use("/", HomeInfo);
//All
router.use("/prod", Prodlist);
//Staff
router.use("/room", RoomInfo);
//Staff
router.use("/prod/movie", MovieInfo);
//Staff
router.use("/prod/song", SongInfo);
router.use('/user', User);
router.use('/ticket', ticket);
router.use("/payment", payment);
router.use("/counter", counter);

router.get("/paymentOption", async function (req, res) {
	console.log("Choosing payment method");
	return res.render('user/PaymentOption');
});
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
		ModelMovieInfo.initialize(database);
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

router.get("/", home_page);
router.get("/home", async function (req, res) {
	return res.redirect("/");
});

/**
 * Renders the home page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function home_page(req, res) {

	class Release {
		constructor(newly, countdown, image) {
			this._newly = newly;
			this._countdown = countdown;
			this._image = image;
		}
		get newly() { return this._newly; }
		set newly(newly) { this._newly = newly; }

		get countdown() { return this._countdown; }
		set countdown(countdown) { this._countdown = countdown; }

		get image() { return this._image; }
		set image(image) { this._image = image; }
	};

	const homeinfo = await ModelHomeInfo.findOne({
		where: {
			"homeinfo_uuid": "test"
		}
	});

	const movieinfo = await ModelMovieInfo.findAll();

	const Newest = []; //Display Newly Created, Display Countdown and Image

	for (let i = 0; i < movieinfo.length; i++) {
		const countDownDate = new Date(movieinfo[i].moviereleasedate).getTime();
		var now = new Date().getTime();
		var distance1 = countDownDate - now;

		const countDownCreation = new Date(movieinfo[i].dateCreated).getTime();
		var now = new Date().getTime();
		var distance2 = countDownCreation - now;

		const release = new Release(distance2, distance1, movieinfo[i].movieimage);
		Newest.push(release);
	}

	var countdown1 = -1;
	var countdown2 = -1;
	var countdown3 = -1;
	var countdown4 = -1;
	var release_img1 = "No-Image-PlaceHolder.png";
	var release_img2 = "No-Image-PlaceHolder.png";
	var release_img3 = "No-Image-PlaceHolder.png";
	var release_img4 = "No-Image-PlaceHolder.png";

	const NewestAgain = Newest.sort();

	if (NewestAgain.length != 0) {

		if (NewestAgain.length == 1) {
			countdown1 = NewestAgain[0]._countdown;
			release_img1 = NewestAgain[0]._image;
		}
		if (NewestAgain.length == 2) {

			countdown1 = NewestAgain[0]._countdown;
			countdown2 = NewestAgain[1]._countdown;
			release_img1 = NewestAgain[0]._image;
			release_img2 = NewestAgain[1]._image;
		}

		if (NewestAgain.length == 3) {

			countdown1 = NewestAgain[0]._countdown;
			countdown2 = NewestAgain[1]._countdown;
			countdown3 = NewestAgain[2]._countdown;
			release_img1 = NewestAgain[0]._image;
			release_img2 = NewestAgain[1]._image;
			release_img3 = NewestAgain[2]._image;
		}
		if (NewestAgain.length == 4) {
			countdown1 = NewestAgain[0]._countdown;
			countdown2 = NewestAgain[1]._countdown;
			countdown3 = NewestAgain[2]._countdown;
			countdown4 = NewestAgain[3]._countdown;
			release_img1 = NewestAgain[0]._image;
			release_img2 = NewestAgain[1]._image;
			release_img3 = NewestAgain[2]._image;
			release_img4 = NewestAgain[3]._image;
		}
	}
	return res.render('home', {
		homedescription: homeinfo.homedescription,
		homepolicy: homeinfo.homepolicy,
		homeimage: homeinfo.homeimage,
		homepolicyimage: homeinfo.homepolicyimage,
		homeinfo_uuid: "test",
		release_img1: release_img1,
		release_img2: release_img2,
		release_img3: release_img3,
		release_img4: release_img4,
		countdown1: countdown1,
		countdown2: countdown2,
		countdown3: countdown3,
		countdown4: countdown4
	});
}


router.get("/contactus", function (req, res) {
	console.log("Contact Us page accessed");
	return res.render("user/contactus", {

	});
});
router.get("/chatbot", function (req, res) {
	console.log("Chatbot page accessed");
	return res.render("user/chatbot", {

	});
});

router.get("*", notfound_page);
function notfound_page(req, res) {
	console.log("Home page accessed");
	return res.render('404');
}
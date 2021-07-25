import { Router } from 'express';
import { Op } from '../data/database.mjs';
import { flashMessage } from '../utils/flashmsg.mjs'
// import { UploadFile, UploadTo, DeleteFile, DeleteFilePath } from '../utils/multer.mjs';
// import axios from 'axios';
import Review from '../routes/user/review.mjs';
import { Modelticket } from '../data/ticket.mjs';
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

router.get("/businessstatistics", businessstatistics_page);

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
router.get("/testing", async function (req, res) {
	console.log("Home page accessed after logging in");
	// After login
	// if role column of ModelUser is customer
	console.log(req.user.role);
	// cannot have document bla
	// accessing the role column of the users table
	if (req.user.role == 'customer') {
		return res.redirect('/customer');
	}
	else if (req.user.role == 'admin') {
		return res.redirect('/home');
	}
});
/**
 * Renders the home page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function home_page(req, res) {
	console.log("Home page accessed");
	const homeinfo = await ModelHomeInfo.findOne({
		where: {
			"homeinfo_uuid" : "test"
		}
	});
		
		return res.render('home', {
			homedescription: homeinfo.homedescription,
			homepolicy: homeinfo.homepolicy,
			homeimage: homeinfo.homeimage,
			homepolicyimage: homeinfo.homepolicyimage,
			release_name1: "Ending in 2 days!",
			release_name2: "Coming Soon!",
			release_name3: "Out Now!",
			release_name4: "Out Now!"
		});
	}

/**
 * Renders the edithomedes page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function edithomedescription_page(req, res) {
	console.log("Home Description page accessed");
	const homeinfo = await ModelHomeInfo.findOne({
		where: {
			"homeinfo_uuid": "test"
		}
	});
	return res.render('edithomedescription',{ homeinfo: homeinfo });
};

/**
* Renders the login page
* @param {Request}  req Express Request handle
* @param {Response} res Express Response handle
*/
async function edithomedescription_process(req, res) {
	try {
		const homedes = await ModelHomeInfo.findOne({
			where: {
				"homeinfo_uuid": "test"
			}
		});
		homedes.update({
			homedescription: req.body.homedescription
			// req.body.homedescription
		});
		homedes.save();
		console.log('Description created: $(homedes.email)');
		return res.redirect("/");
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		const homedes = await ModelHomeInfo.findOne({
			where: {
				"homeinfo_uuid": "test"
			}
		});
		return res.render("/edithomedes",{homedes: homedes});
		//return res.redirect(home_page, { errors: errors });
	}
}

/**
 * Renders the edithomedes page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function edithomeimagepolicy_page(req, res, next) {
	console.log("Home Policy page accessed");
	const homeimagepolicy = await ModelHomeInfo.findOne({
		where: {
			"homeinfo_uuid": "test"
		}
	});
	return res.render('edithomeimagepolicy', { homeimagepolicy: homeimagepolicy });
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function edithomeimagepolicy_process(req, res, next) {
	try {
		const homeimageFile = req.files.homeimage[0];
  		const homepolicyimageFile = req.files.homepolicyimage[0];
		
		const homeimagepolicy = await ModelHomeInfo.findOne({
			where: {
				"homeinfo_uuid": "test"
			}
		});
		const homeimage = './public/uploads/' + homeimagepolicy['homeimage'];
		const homepolicyimage = './public/uploads/' + homeimagepolicy['homepolicyimage'];
		homeimagepolicy.update({
			// req.body.homepolicy
			homepolicy: req.body.homepolicy,
			homeimage: homeimageFile.filename,
			homepolicyimage: homepolicyimageFile.filename
		});
		homeimagepolicy.save();
		fs.unlink(homeimage, function(err) {
			if (err) {
			  throw err
			} else {
			  console.log("Successfully deleted the file.")
			}
		  })
		fs.unlink(homepolicyimage, function(err) {
		if (err) {
			throw err
		} else {
			console.log("Successfully deleted the file.")
		}
		})
		console.log('Description created: $(homeimagepolicy.email)');
		return res.redirect("/");
	}
	catch (error) {
		console.error(`File is uploaded but something crashed`);
		console.error(error);
		DeleteFilePath(homeimageFile);
		DeleteFilePath(homepolicyimageFile);
		return res.render('edithomeimagepolicy', { 
			hey: "Wrong Type of File."
		});
	}
}

// /**
//  * Renders the edithomebestreleases page
//  * @param {Request}  req Express Request handle
//  * @param {Response} res Express Response handle
//  */
// // ---------------- 
// //	TODO:	Common URL paths here
// async function edithomebestreleases_page(req, res) {
// 	console.log("Home Best Releases page accessed");
// 	return res.render('editbestreleases', {

// 	});
// };

// /**
//  * Renders the login page
//  * @param {Request}  req Express Request handle
//  * @param {Response} res Express Response handle
//  */
// async function edithomebestreleases_process(req, res) {
// 	try {
// 		const homebestreleases = await ModelBestReleases.create({
// 			"email": req.body.email,
// 			"homeid": req.body.homeid,
// 			"release_image1": req.body.release_image1,
// 			"release_name1": req.body.release_name1,
// 			"release_image2": req.body.release_image2,
// 			"release_name2": req.body.release_name2,
// 			"release_image3": req.body.release_image3,
// 			"release_name3": req.body.release_name3,
// 			"release_image4": req.body.release_image4,
// 			"release_name4": req.body.release_name4
// 		});
// 		console.log('Description created: $(homebestreleases.email)');
// 	}
// 	catch (error) {
// 		console.error(`Credentials problem: ${req.body.email}`);
// 		console.error(error);
// 		return res.render('/edithomeimagepolicy', { errors: errors });
// 	}
// }

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function prodlist_page(req, res) {
	const roomlist = await ModelRoomInfo.findOne({
		where: {
			"roominfo_uuid": "test"
		}
	});
	const movies = await ModelMovieInfo.findOne({
		where: {
			"movie_uuid": "test"
		}
	});
	const songs = await ModelSongInfo.findOne({
		where: {
			"song_uuid": "test"
		}
	});
	console.log('Prodlist Page accessed');
	return res.render('prodlist', {
		room_title: roomlist.room_title,
		small_roominfo: roomlist.small_roominfo,
		small_roomprice: roomlist.small_roomprice,
		small_roomimage1: roomlist.small_roomimage1,
		small_roomimage2: roomlist.small_roomimage2,
		med_roominfo: roomlist.med_roominfo,
		med_roomprice: roomlist.med_roomprice,
		med_roomimage: roomlist.med_roomimage,
		large_roominfo: roomlist.large_roominfo,
		large_roomprice: roomlist.large_roomprice,
		large_roomimage1: roomlist.large_roomimage1,
		large_roomimage2: roomlist.large_roomimage2,
		movieimage: req.body.movieimage,
		moviename: req.body.moviename,
		movieagerating: req.body.movieagerating,
		movieduration: req.body.movieduration,
		movieHorror: req.body.movieHorror,
		movieComedy: req.body.movieComedy,
		movieScience: req.body.movieScience,
		movieRomance: req.body.movieRomance,
		movieAnimation: req.body.movieAnimation,
		movieAdventure: req.body.movieAdventure,
		movieEmotional: req.body.movieEmotional,
		movieMystery: req.body.movieMystery,
		movieAction: req.body.movieAction,
		songimage: req.body.songimage,
		songname: "songname",
		songagerating: "songagerating",
		songduration: "songduration",
		songPop: req.body.songPop,
		songRock: req.body.songRock,
		songMetal: req.body.songMetal,
		songCountry: req.body.songCountry,
		songRap: req.body.songRap,
		songJazz: req.body.songJazz,
		songFolk: req.body.songFolk
	});
}

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function editrooms_page(req, res) {
	const roomlist = await ModelRoomInfo.findOne({
		where: {
			"roominfo_uuid": "test"
		}
	});
	console.log("Prod List RoomsInfo page accessed");
	return res.render('editrooms', { roomlist: roomlist	});
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function editrooms_process(req, res, next) {
	try {
		const small_roomimage1File = req.files.small_roomimage1[0];
		const small_roomimage2File = req.files.small_roomimage2[0];
		const med_roomimageFile    = req.files.med_roomimage[0];
		const large_roomimage1File = req.files.large_roomimage1[0];
		const large_roomimage2File = req.files.large_roomimage2[0];

		const roomlist = await ModelRoomInfo.findOne({
			where: {
				"roominfo_uuid": "test"
			}
		});
		const small_roomimage1 = './public/uploads/' + roomlist['small_roomimage1'];
		const small_roomimage2 = './public/uploads/' + roomlist['small_roomimage2'];
		const med_roomimage = './public/uploads/' + roomlist['med_roomimage'];
		const large_roomimage1 = './public/uploads/' + roomlist['large_roomimage1'];
		const large_roomimage2 = './public/uploads/' + roomlist['large_roomimage2'];

		roomlist.update({
			"room_title": req.body.room_title,
			"small_roominfo": req.body.small_roominfo,
			"small_roomprice": req.body.small_roomprice,
			"small_roomimage1": small_roomimage1File.filename,
			"small_roomimage2": small_roomimage2File.filename,
			"med_roominfo": req.body.med_roominfo,
			"med_roomprice": req.body.med_roomprice,
			"med_roomimage": med_roomimageFile.filename,
			"large_roominfo": req.body.large_roominfo,
			"large_roomprice": req.body.large_roomprice,
			"large_roomimage1": large_roomimage1File.filename,
			"large_roomimage2": large_roomimage2File.filename
		})
		roomlist.save();
		fs.unlink(small_roomimage1, function(err) {
			if (err) { throw err } 
			else {
				console.log("Successfully deleted the file.")
				fs.unlink(small_roomimage2, function(err) {
					if (err) { throw err } 
					else {
						console.log("Successfully deleted the file.")
						fs.unlink(med_roomimage, function(err) {
							if (err) { throw err } 
							else {
								console.log("Successfully deleted the file.")
								fs.unlink(large_roomimage1, function(err) {
									if (err) { throw err } 
									else {
										console.log("Successfully deleted the file.")
										fs.unlink(large_roomimage2, function(err) {
											if (err) { throw err } 
											else {
											  console.log("Successfully deleted the file.")
											}
										  })
									}
								  })
							}
						  })
					}
				  })
			}
		  })

		console.log('Description created: $(roomlist.email)');
		return res.redirect("/prod/list");
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('editrooms');
	}
}

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
router.get("/logout", async function (req, res) {
	req.session.destroy((err) => {
		if (err) {
			return console.log(err);
		}
		res.redirect("/home");
	});
});


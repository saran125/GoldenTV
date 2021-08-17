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
import {ModelRoomInfo} from '../data/roominfo.mjs';
import {Modelticket} from '../data/tickets.mjs';
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
let amount = [];
let name = []
router.get("/", home_page);
let customer_name = [];
router.get("/home", async function (req, res) {
	amount = [];
	name = [];
	customer_name = [];
	ModelUser.sync({ alert: true }).then(() => {
		return ModelUser.findAll({ attributes: ['name'], where: { role: 'customer' } });
	}).then((data) => {
		data.forEach(element => {
			customer_name.push(element.toJSON().name);
			console.log(element.toJSON().name);
		})
		console.log(customer_name);
		value()
	})

	
		ModelRoomInfo.sync({ alert: true }).then(() => {
			return ModelRoomInfo.findAll({ attributes: ['roomname'] });
		}).then((data) => {
			let hello = [];
			data.forEach(element => {
				name.push(element.toJSON().roomname);
				hello.push(element.toJSON().roomname);
				console.log(element.toJSON().roomname);
			})
			console.log(name);
			return res.redirect("/");
			
		})
});


async function value(){
		for (let i = 0; i < customer_name.length; i++) {
			const user = await ModelUser.findOne({ where: { name: customer_name[i], role: "customer" } });
			console.log(user.name);
			let price = 0;
			let each_amount = [];
			Modelticket.sync({ alert: true }).then(() => {
				return Modelticket.findAll({ attributes: ['price'], where: { user_id: user.uuid } });
			}).then((data) => {
				data.forEach(element => {
					each_amount.push(element.toJSON().price);
					console.log(element.toJSON().price);
				})
				for (let e = 0; e < each_amount.length; e++) {
					price += each_amount[e]
				}
				amount.push(price);
				console.log(price);
			})
		}
	}
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

	if (Newest.length == 1) {
		const NewestAgain = Newest.sort();

		var countdown1 = NewestAgain[0]._countdown;
		var countdown2 = -1;
		var countdown3 = -1;
		var countdown4 = -1;
		var release_img1 = NewestAgain[0]._image;
		var release_img2 = "No-Image-PlaceHolder.png";
		var release_img3 = "No-Image-PlaceHolder.png";
		var release_img4 = "No-Image-PlaceHolder.png";
	}
	if (Newest.length == 2) {
		const NewestAgain = Newest.sort();
		var countdown1 = NewestAgain[0]._countdown;
		var countdown2 = NewestAgain[1]._countdown;
		var countdown3 = -1;
		var countdown4 = -1;
		var release_img1 = NewestAgain[0]._image;
		var release_img2 = NewestAgain[1]._image;
		var release_img3 = "No-Image-PlaceHolder.png";
		var release_img4 = "No-Image-PlaceHolder.png";
	}

	if (Newest.length == 3) {
		const NewestAgain = Newest.sort();
		var countdown1 = NewestAgain[0]._countdown;
		var countdown2 = NewestAgain[1]._countdown;
		var countdown3 = NewestAgain[2]._countdown;
		var countdown4 = -1;
		var release_img1 = NewestAgain[0]._image;
		var release_img2 = NewestAgain[1]._image;
		var release_img3 = NewestAgain[2]._image;
		var release_img4 = "No-Image-PlaceHolder.png";
	}
	else {
		const NewestAgain = Newest.sort();
		var countdown1 = NewestAgain[0]._countdown;
		var countdown2 = NewestAgain[1]._countdown;
		var countdown3 = NewestAgain[2]._countdown;
		var countdown4 = NewestAgain[3]._countdown;
		var release_img1 = NewestAgain[0]._image;
		var release_img2 = NewestAgain[1]._image;
		var release_img3 = NewestAgain[2]._image;
		var release_img4 = NewestAgain[3]._image;
	}

	return res.render('home', {
		homedescription: homeinfo.homedescription,
		homepolicy: homeinfo.homepolicy,
		homeimage: homeinfo.homeimage,
		homepolicyimage: homeinfo.homepolicyimage,
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
router.get("/contactus", async function (req, res) {
	console.log("Contact Us page accessed");
	return res.render("user/contactus", {
	});
});
router.get("/chatbot", function (req, res) {
	console.log("Chatbot page accessed");
	return res.render("user/chatbot", {

	});
});
router.get("/rooms/chart", async function(req,res){
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'manager') {
	console.log("accessing chart");
	const DATA_COUNT = await ModelRoomInfo.findAndCountAll({raw:true});
	console.log(DATA_COUNT.count);
	console.log(name);
	let movie = [];
	let karaoke = [];
	let roomname = [];
	for(let i = 0; i< DATA_COUNT.count; i++ ){
		const location = await ModelRoomInfo.findOne({where:{roomname:name[i]}});
		const m = await Modelticket.findAndCountAll({ where: { room_id: location.room_uuid, choice:'Movie'} });
		const s = await Modelticket.findAndCountAll({ where: { room_id: location.room_uuid, choice:'Karaoke' } });
		movie.push(m.count);
		karaoke.push(s.count);
		console.log(m);
		roomname.push(name[i]);
	}
	console.log(movie);
	console.log(karaoke);
	const labels = roomname;
	
	return res.render('chart',{label:labels, movie:movie, song:karaoke});
		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
});

router.get("/customers/chart", async function (req, res) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'manager') {
	console.log("accessing chart");
	console.log(customer_name);
	console.log(amount);
	let spend = [];
	let names = [];
	const data_count = await ModelUser.findAndCountAll({ where:{role:'customer'} });
	for(let i = 0; i <data_count.count;i++){
		spend.push(customer_name[i]);
		names.push(amount[i])
	}
	const labels = spend;
	const data = names;
	return res.render('customer', { label: labels, data: data});
		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
});

router.get("*", notfound_page);
function notfound_page(req, res) {
	console.log("Home page accessed");
	return res.render('404');
}
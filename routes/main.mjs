import { Router } from 'express';
import { Op } from '../data/database.mjs';
import { flashMessage } from '../utils/flashmsg.mjs'
// import { upload } from '../utils/multer.mjs'
// import { UploadFile, UploadTo, DeleteFile, DeleteFilePath } from '../utils/multer.mjs';
// import axios from 'axios';
import { ModelHomeDescription } from '../data/homedescription.mjs';
import { ModelHomeImagePolicy } from '../data/homeimagepolicy.mjs';
import { ModelBestReleases } from '../data/homebestreleases.mjs';
import { ModelRooms } from '../data/rooms.mjs';
import { ModelMovies } from '../data/movies.mjs';
import { ModelSongs } from '../data/karaoke.mjs';
import Routerfaq from '../routes/admin/faq.mjs';
import Review from '../routes/user/review.mjs';
import { Modelticket } from '../data/ticket.mjs';
// import Passport from 'passport';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import express from 'express';
import methodOverride from 'method-override';
import payment from '../routes/payment.mjs';
const router = Router();
export default router;
router.use("/faq", Routerfaq);
router.use("/review", Review);
import Admin from '../routes/admin/admin.js';
import User from '../routes/user/user.js';
// router.use("/sendemail", Email);
router.use("/admin", Admin)
router.use('/user', User)
router.use("/payment", payment);
router.get("/paymentOption", async function (req, res) {
	console.log("Choosing payment method");
	return res.render('PaymentOption');
});
router.get("/ticketlist/tickettable", tickettable);
router.get("/ticketlist/tickettable-data", tickettable_data);
async function tickettable(req, res) {
	return res.render('user/tickets');
}
async function tickettable_data(req, res) {
	const ticket = await Modelticket.findAll({ raw: true });
	return res.json({
		"total": ticket.length,
		"rows": ticket
	});
}

router.get("/view/:uuid", async function (req, res, next) {
	const tid = req.params.uuid;
	console.log("ticket page accessed");
	try {
		if (tid == undefined) {
			throw new HttpError(400, "Target user id is invalid");
		}
		const target_user = await Modelticket.findOne({
			where: {
				uuid: tid
			}
		});
		if (target_user == null) {
			throw new HttpError(410, "User doesn't exists");
		}
		console.log(target_user);
		return res.render("user/view", {
			target: target_user
		});
	}
	catch (error) {
		console.error(`Invalid request: ${tid}`);
		error.code = (error.code == undefined) ? 500 : error.code;
		console.log(error);
		return next(error);
	}
});
/**
 * @param database {ORM.Sequelize}
 */
export function initialize_models(database) {
	try {
		console.log("Intitializing ORM models");
		//	Initialzie models
		ModelUser.initialize(database);
		ModelHomeDescription.initialize(database);
		ModelHomeImagePolicy.initialize(database);
		ModelBestReleases.initialize(database);
		ModelRooms.initialize(database);
		ModelMovies.initialize(database);
		ModelSongs.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc

		console.log("Adding intitialization hooks");
		//	Run once hooks during initialization 
		database.addHook("afterBulkSync", generate_root_account.name, generate_root_account.bind(this, database));
		database.addHook("afterBulkSync", generate_homedescription.email, generate_homedescription.bind(this, database));
		database.addHook("afterBulkSync", generate_homeimagepolicy.email, generate_homeimagepolicy.bind(this, database));
		database.addHook("afterBulkSync", generate_bestreleases.email, generate_bestreleases.bind(this, database));
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

// Creates static folder for publicly accessible HTML, CSS and Javascript files
router.use(express.static(path.join(process.cwd(), 'public')));

router.use(methodOverride('_method'));

router.get("/", home_page);
// '/edit/:id'
router.get("/edithomedes", edithomedescription_page);
router.post("/edithomedes", edithomedescription_process);

router.get("/edithomeimagepolicy", edithomeimagepolicy_page);

var storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './public/uploads/');
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	}
});

// this code goes inside the object passed to multer()
function fileFilter (req, file, cb) {    
	// Allowed ext
	 const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
	const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
   if(mimetype && extname){
	   return cb(null,true);
   } else {
	   cb('Error: Images Only!');
   }
  }

const upload = multer({ 
	storage: storage,
	limits : {fileSize : 1000000},
	fileFilter : fileFilter
});

/**
 * Function to delete a uploaded file
 * @param files {...string}
**/
export function DeleteFilePath(...files) {
	for (let file of files) {
		if (FileSys.existsSync(file)) {
			console.log(`Removing from server: ${file}`);
			return FileSys.unlinkSync(file);
		}
		else
			console.warn(`Attempting to delete non-existing file(s) ${file}`);
	}
} 
router.post("/edithomeimagepolicy",
upload.fields([
    { name: 'homeimage', maxCount: 1 },
    { name: 'homepolicyimage', maxCount: 1 },
  ]), 
edithomeimagepolicy_process);
router.get("/edithomebestreleases", edithomebestreleases_page);
router.post("/edithomebestreleases", edithomebestreleases_process);
router.get("/prodlist", prodlist_page);

router.get("/prodlist/editroominfo", editrooms_page);
router.post("/prodlist/editroominfo", 
upload.fields([
    { name: 'small_roomimage1', maxCount: 1 },
    { name: 'small_roomimage2', maxCount: 1 },
	{ name: 'med_roomimage', maxCount: 1 },
    { name: 'large_roomimage1', maxCount: 1 },
    { name: 'large_roomimage2', maxCount: 1 }	
  ]),
editrooms_process);

// router.get ("/axios-test",  example_axios);
// router.get ("/prodlist/chooseeditmoviestable", chooseeditmoviestable);
// router.get ("/prodlist/chooseeditmoviestable-data", chooseeditmoviestable_data);

// router.get("/prodlist/chooseeditsongs", chooseeditsongs_page);

// router.get("/prodlist/editmovie", editmovie_page);
// router.post("/prodlist/editmovie", editmovie_process);

router.get("/prodlist/editsong", editsong_page);
router.post("/prodlist/editsong", editsong_process);

router.get("/prodlist/createmovie", createmovie_page);
router.post("/prodlist/createmovie",  
upload.single('movieimage'),
createmovie_process);

router.get("/prodlist/createsong", createsong_page);
router.post("/prodlist/createsong", 
upload.single('songimage'),
createsong_process);

router.get("/businessstatistics", businessstatistics_page);

class UserRole {
	static get Admin() { return "admin"; }
	static get User()  { return "user";  }
}
// router.use(ensure_auth);
router.use(ensure_admin);

// /**
//  * Ensure that all routes in this router can be used only by admin role
//  * @param {import('express').Request} req 
//  * @param {import('express').Response} res 
//  * @param {import('express').NextFunction} next 
//  */
//  async function ensure_auth(req, res, next) {
//     if (!req.isAuthenticated()) {
//         return res.sendStatus(401);
//     }
//     else {
//         return next();
//     }
// }

/**
 * Ensure that all routes in this router can be used only by admin role
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
 async function ensure_admin(req, res, next) {
    /** @type {ModelHomeDescription} */
    const userAdmin = req.body;
	const userUser = "user"
    if (userAdmin.role != UserRole.Admin) {
        return next();
		//Forbidden
    }
    else {
        return res.sendStatus(403);
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
	// const userrole = new UserRole();
	// userrole1 = "Admin"
	// userrole2 = "User"
	const homedes = await ModelHomeDescription.findOne({
		where: {
			"email": "root@mail.com"
		}
	});
	const homeimagepolicy = await ModelHomeImagePolicy.findOne({
		where: {
			"email": "root@mail.com"
		}
	});
	const homebestreleases = await ModelBestReleases.findOne({
		where: {
			"email": "root@mail.com"
		}
	});
	console.log("Home page accessed");
	return res.render('home', {
		// Admin: userrole1,
		homedescription: homedes.homedescription,
		homepolicy: homeimagepolicy.homepolicy,
		homeimage: homeimagepolicy.homeimage,
		homepolicyimage: homeimagepolicy.homepolicyimage,
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
	const homedes = await ModelHomeDescription.findOne({
		where: {
			"email": "root@mail.com"
		}
	});
	return res.render('edithomedescription',{ homedes: homedes});
};

/**
* Renders the login page
* @param {Request}  req Express Request handle
* @param {Response} res Express Response handle
*/
async function edithomedescription_process(req, res) {
	try {
		const homedes = await ModelHomeDescription.findOne({
			where: {
				"email": "root@mail.com"
			}
		});
		homedes.update({
			homedescription: req.body.homedescription
		});
		homedes.save();
		console.log('Description created: $(homedes.email)');
		return res.redirect("/");
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		const homedes = await ModelHomeDescription.findOne({
			where: {
				"email": "root@mail.com"
			}
		});
		return res.render("/edithomedes",{ homedes: homedes});
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
	const homeimagepolicy = await ModelHomeImagePolicy.findOne({
		where: {
			"email": "root@mail.com"
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
		const file = req.file;
		//console.log(homeimage);
		// if (!file) {
		// 	const error = new Error("Please upload a file");
		// 	error.httpStatusCode = 400;
		// 	return next(error);
		//   }

		const homeimageFile = req.files.homeimage[0];
  		const homepolicyimageFile = req.files.homepolicyimage[0];
		
		const homeimagepolicy = await ModelHomeImagePolicy.findOne({
			where: {
				"email": "root@mail.com"
			}
		});
		homeimagepolicy.update({
			// req.body.homepolicy
			homepolicy: req.body.homepolicy,
			homeimage: homeimageFile.filename,
			homepolicyimage: homepolicyimageFile.filename
		});
		homeimagepolicy.save();
		// res.send(homeimagepath);
		// res.send(homepolicyimagepath);
		console.log('Description created: $(homeimagepolicy.email)');
		return res.redirect("/");
	}
	catch (error) {
		console.error(`File is uploaded but something crashed`);
		console.error(error);
		return res.render('edithomeimagepolicy', { 
			hey: "Wrong Type of File."
		});
	}
}

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function edithomebestreleases_page(req, res) {
	console.log("Home Best Releases page accessed");
	return res.render('editbestreleases', {

	});
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function edithomebestreleases_process(req, res) {
	try {
		const homebestreleases = await ModelBestReleases.create({
			"email": req.body.email,
			"homeid": req.body.homeid,
			"release_image1": req.body.release_image1,
			"release_name1": req.body.release_name1,
			"release_image2": req.body.release_image2,
			"release_name2": req.body.release_name2,
			"release_image3": req.body.release_image3,
			"release_name3": req.body.release_name3,
			"release_image4": req.body.release_image4,
			"release_name4": req.body.release_name4
		});
		console.log('Description created: $(homebestreleases.email)');
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('/edithomeimagepolicy', { errors: errors });
	}
}

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function prodlist_page(req, res) {
	const roomlist = await ModelRooms.findOne({
		where: {
			"email": "root@mail.com"
		}
	});
	const createmovies = await ModelMovies.findOne({
		where: {
			"email": "root@mail.com"
		}
	});
	const createsongs = await ModelSongs.findOne({
		where: {
			"email": "root@mail.com"
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
	const roomlist = await ModelRooms.findOne({
		where: {
			"email": "root@mail.com"
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

		const roomlist = await ModelRooms.findOne({
			where: {
				"email": "root@mail.com"
			}
		});
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
		console.log('Description created: $(roomlist.email)');
		return res.redirect("/prodlist");
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('editrooms');
	}
}
// router.get("/api/list", api_list);
// router.get ("/axios-test",  example_axios);
router.get ("/prodlist/chooseeditmoviestable", chooseeditmoviestable);
router.get ("/prodlist/chooseeditmoviestable-data", chooseeditmoviestable_data);
router.get ("/prodlist/updatemovie/:uuid", updatemovie_page);
router.put ("/prodlist/updatemovie/:uuid", 
upload.single('movieimage'),
updatemovie_process);
router.get ("/prodlist/deletemovie/:uuid", deletemovie);
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

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
 async function deletemovie(req, res, next) {
	try {
		const tid = String(req.params.uuid);
		// if (tid == undefined)
		// 	throw new HttpError(400, "Target not specified");

		const target = await ModelMovies.findByPk(tid);

		// if (target == null)
		// 	throw new HttpError(410, "User doesn't exists");

		target.destroy();
		console.log(`Deleted movie: ${tid}`);
		return res.redirect("/prodlist/chooseeditmoviestable");
	}
	catch (error) {
		console.error(`Failed to delete`)
		error.code = (error.code) ? error.code : 500;
		return next(error);
	}
}

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function updatemovie_page(req, res) {
	const tid = String(req.params.uuid);
	const movie = await ModelMovies.findByPk(tid);
	console.log("Prod List RoomsInfo page accessed");
	return res.render('updatemovie', 
	{ movie : movie,
	  movieRomance: movie.movieRomance }
	);
};

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
 async function updatemovie_process(req, res) {
	try {
		const tid = String(req.params.uuid);
		const movie = await ModelMovies.findByPk(tid);
		
		movie.update({
			"movieimage": req.file.filename,
			"moviename": req.body.moviename,
			"movieagerating": req.body.movieagerating,
			"movieduration": req.body.movieduration,

			"movieHorror": Boolean(req.body.movieHorror),
			"movieComedy": Boolean(req.body.movieComedy),
			"movieScience": Boolean(req.body.movieScience),
			"movieRomance": Boolean(req.body.movieRomance),
			"movieAnimation": Boolean(req.body.movieAnimation),
			"movieAdventure": Boolean(req.body.movieAdventure),
			"movieEmotional": Boolean(req.body.movieEmotional),
			"movieMystery": Boolean(req.body.movieMystery),
			"movieAction": Boolean(req.body.movieAction)
		});
		movie.save();
		console.log('Description created: $(movie.email)');
		return res.redirect("/prodlist/chooseeditmoviestable");
	}
	catch (error) {
		console.error(`Failed to update user ${req.body.uuid}`);
		console.error(error);
		const movie  = await ModelMovies.findByPk(tid);
		return res.render("updatemovie",{movie:movie});
	}
}

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditmoviestable(req, res) {
	return res.render('chooseeditmoviestable'); 
}

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditmoviestable_data(req, res) {
	try {
		let pageSize  = parseInt(req.query.limit);    //(req.query.pageSize)? req.query.pageSize : 10;
		let offset    = parseInt(req.query.offset);   //page * pageSize;
		let sortBy    = (req.query.sort)?   req.query.sort  : "dateCreated";
		let sortOrder = (req.query.order)?  req.query.order : "desc";
		let search    = req.query.search;

		//if (page < 0)     throw new HttpError(400, "Invalid page number");
		if (pageSize < 0) throw new HttpError(400, "Invalid page size");
		if (offset < 0)   throw new HttpError(400, "Invalid offset index");

		// TODO: Do your search filter with this
		/** @type {import('sequelize/types').WhereOptions} */
		const conditions   = (search) ? {
			[Op.or]: {
				"dateCreated":  { [Op.substring]: search }, 
				"dateUpdated":  { [Op.substring]: search }, 
				"moviename":  { [Op.substring]: search }, 
				"movieagerating": { [Op.substring]: search },
				"movieduration": { [Op.substring]: search },
				"movieHorror": { [Op.substring]: search },
				"movieComedy": { [Op.substring]: search },
				"movieScience": { [Op.substring]: search },
				"movieRomance": { [Op.substring]: search },
				"movieAnimation": { [Op.substring]: search },
				"movieEmotional": { [Op.substring]: search },
				"movieMystery": { [Op.substring]: search },
				"movieAction": { [Op.substring]: search }
			}
		} : undefined;

		const total        = await ModelMovies.count({where: conditions});
		const pageTotal    = Math.ceil(total / pageSize);
		//	Clamp values to prevent overflow
		//page   = (page   < pageTotal)? page : pageTotal;
		//offset = (page - 1) * pageSize;

		const pageContents = await ModelMovies.findAll({
			offset: offset,
			limit:  pageSize,
			order: [[sortBy, sortOrder.toUpperCase()]],
			where:  conditions,
			raw:    true	//	Data only, model excluded
		});

		// const choosemovies = await ModelMovies.findAll({raw: true});
		return res.json({
			"total": total,
			"rows": pageContents
		});
	}
	catch (error) {
		console.error(`Request query errors`);
		console.error(error);
		return next(new HttpError(400, error.message));
	}
}

router.get ("/prodlist/chooseeditsongstable", chooseeditsongstable);
router.get ("/prodlist/chooseeditsongstable-data", chooseeditsongstable_data);
router.get ("/prodlist/updatesong/:uuid", updatesong_page);
router.put ("/prodlist/updatesong/:uuid", 
upload.single('songimage'),
updatesong_process);
router.get ("/prodlist/deletesong/:uuid", deletesong);

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function updatesong_page(req, res) {
	const tid = String(req.params.uuid);
	const song = await ModelSongs.findByPk(tid);
	console.log("Prod List RoomsInfo page accessed");
	return res.render('updatesong', 
	{ song :song}
	);
};

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
 async function updatesong_process(req, res) {
	try {
		const tid = String(req.params.uuid);
		const song = await ModelSongs.findByPk(tid);
		
		song.update({
			"songimage": req.file.filename,
			"songname": req.body.songname,
			"songagerating": req.body.songagerating,
			"songduration": req.body.songduration,

			"songPop": Boolean(req.body.songPop),
			"songRock": Boolean(req.body.songRock),
			"songMetal": Boolean(req.body.songMetal),
			"songCountry": Boolean(req.body.songCountry),
			"songRap": Boolean(req.body.songRap),
			"songElectronic": Boolean(req.body.songElectronic),
			"songJazz": Boolean(req.body.songJazz),
			"songFolk": Boolean(req.body.songFolk)
		});
		song.save();
		console.log('Description created: $(movie.email)');
		return res.redirect("/prodlist/chooseeditsongstable");
	}
	catch (error) {
		console.error(`Failed to update user ${req.body.uuid}`);
		console.error(error);
		const song  = await ModelSongs.findByPk(tid);
		return res.render("updatesong",{song:song});
	}
}

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditsongstable(req, res) {
	return res.render('chooseeditsongstable'); 
}

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditsongstable_data(req, res) {
	try {
		let pageSize  = parseInt(req.query.limit);    //(req.query.pageSize)? req.query.pageSize : 10;
		let offset    = parseInt(req.query.offset);   //page * pageSize;
		let sortBy    = (req.query.sort)?   req.query.sort  : "dateCreated";
		let sortOrder = (req.query.order)?  req.query.order : "desc";
		let search    = req.query.search;

		//if (page < 0)     throw new HttpError(400, "Invalid page number");
		if (pageSize < 0) throw new HttpError(400, "Invalid page size");
		if (offset < 0)   throw new HttpError(400, "Invalid offset index");

		// TODO: Do your search filter with this
		/** @type {import('sequelize/types').WhereOptions} */
		const conditions   = (search) ? {
			[Op.or]: {
				"dateCreated":  { [Op.substring]: search }, 
				"dateUpdated":  { [Op.substring]: search }, 
				"songname":  { [Op.substring]: search }, 
				"songagerating": { [Op.substring]: search },
				"songduration": { [Op.substring]: search },
				"songPop": { [Op.substring]: search },
				"songRock": { [Op.substring]: search },
				"songMetal": { [Op.substring]: search },
				"songCountry": { [Op.substring]: search },
				"songRap": { [Op.substring]: search },
				"songElectronic": { [Op.substring]: search },
				"songJazz": { [Op.substring]: search },
				"songFolk": { [Op.substring]: search }
			}
		} : undefined;

		const total        = await ModelSongs.count({where: conditions});
		const pageTotal    = Math.ceil(total / pageSize);
		//	Clamp values to prevent overflow
		//page   = (page   < pageTotal)? page : pageTotal;
		//offset = (page - 1) * pageSize;

		const pageContents = await ModelSongs.findAll({
			offset: offset,
			limit:  pageSize,
			order: [[sortBy, sortOrder.toUpperCase()]],
			where:  conditions,
			raw:    true	//	Data only, model excluded
		});

		// const choosemovies = await ModelMovies.findAll({raw: true});
		return res.json({
			"total": total,
			"rows": pageContents
		});
	}
	catch (error) {
		console.error(`Request query errors`);
		console.error(error);
		return next(new HttpError(400, error.message));
	}
}
/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function createmovie_page(req, res) {
	console.log("Prod List Choose Edit Movie page accessed");
	return res.render('createmovies', {

	});
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function createmovie_process(req, res, next) {
	try {
		// const movieimageFile = req.file[0];
		const createmovies = await ModelMovies.create({
			"uuid": req.body.uuid,
			"email": "root@mail.com",
			"role": "admin",
			"verified": true,
			"prodlistid": "prodlistid",
			"choosemovieid": "choosemovieid",
			"movieimage": req.file.filename,
			"moviename": req.body.moviename,
			"movieagerating": req.body.movieagerating,
			"movieduration": req.body.movieduration,

			"movieHorror": Boolean(req.body.movieHorror),
			"movieComedy": Boolean(req.body.movieComedy),
			"movieScience": Boolean(req.body.movieScience),
			"movieRomance": Boolean(req.body.movieRomance),
			"movieAnimation": Boolean(req.body.movieAnimation),
			"movieAdventure": Boolean(req.body.movieAdventure),
			"movieEmotional": Boolean(req.body.movieEmotional),
			"movieMystery": Boolean(req.body.movieMystery),
			"movieAction": Boolean(req.body.movieAction)
		});
		console.log('Description created: $(createmovies.email)');
		createmovies.save();
		return res.redirect("/prodlist/chooseeditmoviestable"
		// , { email: email }
		);
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('createmovies', 
		// { errors: errors }
		);
	}
}

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

// /**
//  * Renders the login page
//  * @param {Request}  req Express Request handle
//  * @param {Response} res Express Response handle
//  */
// async function editmovie_process(req, res) {
// 	try {
// 		const editmovies = await ModelMovies.create({
// 			"email": req.body.email,
// 			"prodlistid": req.body.prodlistid,
// 			"choosemovieid": req.body.choosemovieid,
// 			"movieimage": req.body.movieimage,
// 			"moviename": req.body.moviename,
// 			"movieagerating": req.body.movieagerating,
// 			"movieduration": req.body.movieduration,

// 			"movieHorror": req.body.movieHorror,
// 			"movieComedy": req.body.movieComedy,
// 			"movieScience": req.body.movieScience,
// 			"movieRomance": req.body.movieRomance,
// 			"movieAnimation": req.body.movieAnimation,
// 			"movieAdventure": req.body.movieAdventure,
// 			"movieEmotional": req.body.movieEmotional,
// 			"movieMystery": req.body.movieMystery,
// 			"movieAction": req.body.movieAction
// 		});
// 		console.log('Description created: $(editmovies.email)');
// 	}
// 	catch (error) {
// 		console.error(`Credentials problem: ${req.body.email}`);
// 		console.error(error);
// 		return res.render('home', { errors: errors });
// 	}
// }

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function createsong_page(req, res) {
	console.log("Prod List Create Songs page accessed");
	return res.render('createsongs', {

	});
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */

async function createsong_process(req, res) {
	try {
		const createsongs = await ModelSongs.create({
			"uuid": req.body.uuid,
			"email": "root@mail.com",
			"role": "admin",
			"verified": true,
			"prodlistid": "prodlistid",
			"choosekaraokeid": "choosekaraokeid",

			"songimage": req.file.filename,
			"songname": req.body.songname,
			"songagerating": req.body.songagerating,
			"songduration": req.body.songduration,

			"songPop": Boolean(req.body.songPop),
			"songRock": Boolean(req.body.songRock),
			"songMetal": Boolean(req.body.songMetal),
			"songCountry": Boolean(req.body.songCountry),
			"songElectronic" : Boolean(req.body.songElectronic),
			"songRap": Boolean(req.body.songRap),
			"songJazz": Boolean(req.body.songJazz),
			"songFolk": Boolean(req.body.songFolk)
		});
		createsongs.save()
		console.log('Description created: $(createsongs.email)');
		return res.redirect("/prodlist/chooseeditsongstable"
		// , { email: email }
		);
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('createsongs', 
		// { errors: errors }
		);
	}
}

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
 async function deletesong(req, res, next) {
	try {
		const tid = String(req.params.uuid);
		// if (tid == undefined)
		// 	throw new HttpError(400, "Target not specified");

		const target = await ModelSongs.findByPk(tid);

		// if (target == null)
		// 	throw new HttpError(410, "User doesn't exists");

		target.destroy();
		console.log(`Deleted song: ${tid}`);
		return res.redirect("/prodlist/chooseeditsongstable");
	}
	catch (error) {
		console.error(`Failed to delete`)
		error.code = (error.code) ? error.code : 500;
		return next(error);
	}
}

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function editsong_page(req, res) {
	console.log("Prod List Edit Songs page accessed");
	return res.render('updatesongs', {

	});
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */

async function editsong_process(req, res) {
	try {
		const editsong = await ModelSongs.create({
			"email": req.body.email,
			"prodlistid": req.body.prodlistid,
			"choosekaraokeid": req.body.choosekaraokeid,

			"songimage": req.body.songimage,
			"songname": req.body.songname,
			"songagerating": req.body.songagerating,
			"songduration": req.body.songduration,

			"songPop": req.body.songPop,
			"songRock": req.body.songRock,
			"songMetal": req.body.songMetal,
			"songCountry": req.body.songCountry,
			"songRap": req.body.songRap,
			"songElectronic": req.body.songElectronic,
			"songJazz": req.body.songJazz,
			"songFolk": req.body.songFolk
		});
		console.log('Description created: $(editsong.email)');
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('home', { errors: errors });
	}
}

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

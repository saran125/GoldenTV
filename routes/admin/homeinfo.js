import { Router } from 'express';
import { ModelHomeInfo } from '../../data/homeinfo.mjs';
import { ModelMovieInfo } from '../../data/movieinfo.mjs';
import { upload } from '../../utils/multer.mjs';
// import multer from 'multer';
import fs from 'fs';
import ORM from "sequelize";
import { Console } from 'console';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

router.get("/", home_page);
router.get("/home", async function (req, res) {
	return res.redirect("/");
});
router.get("/choosereleasetable-data", choosereleasetable_data);

router.get("/edithomedes", edithomedescription_page);
router.post("/edithomedes", edithomedescription_process);
router.get("/edithomeimagepolicy", edithomeimagepolicy_page);
router.post("/edithomeimagepolicy",
	upload.fields([
		{ name: 'homeimage', maxCount: 1 },
		{ name: 'homepolicyimage', maxCount: 1 },
	]),
	edithomeimagepolicy_process);






/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function choosereleasetable_data(req, res) {
	try {
		let pageSize = parseInt(req.query.limit);    //(req.query.pageSize)? req.query.pageSize : 10;
		let offset = parseInt(req.query.offset);   //page * pageSize;
		let sortBy = (req.query.sort) ? req.query.sort : "dateCreated";
		let sortOrder = (req.query.order) ? req.query.order : "asc";
		let search = req.query.search;

		//if (page < 0)     throw new HttpError(400, "Invalid page number");
		if (pageSize < 0) throw new HttpError(400, "Invalid page size");
		if (offset < 0) throw new HttpError(400, "Invalid offset index");

		// TODO: Do your search filter with this
		/** @type {import('sequelize/types').WhereOptions} */
		const conditions = (search) ? {
			[Op.or]: {
				"dateCreated": { [Op.substring]: search },
				"dateUpdated": { [Op.substring]: search },
				"moviereleasedate": { [Op.substring]: search },
				"movieenddate": { [Op.substring]: search },
				"moviename": { [Op.substring]: search },
				"movieagerating": { [Op.substring]: search },
				"movieduration": { [Op.substring]: search },
				"moviegenre": { [Op.substring]: search },
				"movie_uuid": { [Op.substring]: req.body.movie_uuid }
			}
		} : undefined;

		const total = await ModelMovieInfo.count({ where: conditions });
		const pageTotal = Math.ceil(total / pageSize);

		const pageContents = await ModelMovieInfo.findAll({
			offset: offset,
			limit: pageSize,
			order: [[sortBy, sortOrder.toUpperCase()]],
			where: conditions,
			raw: true	//	Data only, model excluded
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
		// return next(new HttpError(400, error.message));
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

	const homeinfo = await ModelHomeInfo.findOne({
		where: {
			"homeinfo_uuid": "test"
		}
	});

	// const movieinfo = await ModelMovieInfo.findAll({
	// 	// where: {
	// 	// 	"admin_uuid": '4ea99629-8760-44b6-95f8-762a4b1f8a87'
	// 	// }
	// });

	// const diff = {};

	// const Newest = [];
	// const Length = movieinfo.length;

	// // for (let i = 0; i < Length; i++) {
	// // 	findnewestimage.push(movieinfo[i].movieimage);
	// // }

	// for (let i = 0; i < Length; i++) {
	// 	const countDownDate = new Date(movieinfo[i].dateCreated).getTime();
	// 	var now = new Date().getTime();
	// 	var distance = countDownDate - now;

	// 	// Newest.push(distance);
	// 	diff[distance] = movieinfo[i].movieimage;
	// }

	// for (var key in diff) {
	// 	Newest.push(key);
	// }
	
	// const ComingSoon = "Comgin "
	// const NewestSorted = Newest.sort(); //Milliseconds ASC
	
	// if (NewestSorted.length == 0) {
	// 	NewestSorted.push("Coming Soon!")
	// }
	// if (NewestSorted.length == 1) {
	// 	NewestSorted.push("Coming Soon!")
	// }
	// if (NewestSorted.length == 2) {
	// 	NewestSorted.push("Coming Soon!")
	// }
	// if (NewestSorted.length == 3) {
	// 	NewestSorted.push("Coming Soon!")
	// }

	// for (var key in diff) {
	// 	if (key == Newest[-1]) {
	// 		One = diff[0];
	// 	}
	// }	

	// logout, just render index.handlebars

	return res.render('home', {
		homedescription: homeinfo.homedescription,
		homepolicy: homeinfo.homepolicy,
		homeimage: homeinfo.homeimage,
		homepolicyimage: homeinfo.homepolicyimage
		// release_name1: NewestSorted[0],
		// release_name2: NewestSorted[-2],
		// release_name3: NewestSorted[-3],
		// release_name4: NewestSorted[-4]
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
	const homedes = await ModelHomeInfo.findOne({
		where: {
			"homeinfo_uuid": "test"
		}
	});

	return res.render('admin/home/edithomedescription',
		{
			homedes: homedes
		});
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
		return res.render("/edithomedes", { homedes: homedes });
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
	return res.render('admin/home/edithomeimagepolicy', { homeimagepolicy: homeimagepolicy });
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
			homepolicy: req.body.homepolicy,
			homeimage: homeimageFile.filename,
			homepolicyimage: homepolicyimageFile.filename
		});
		homeimagepolicy.save();
		fs.unlink(homeimage, function (err) {
			if (err) {
				throw err
			} else {
				console.log("Successfully deleted the file.")
			}
		})
		fs.unlink(homepolicyimage, function (err) {
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
		const homeimage = './public/uploads/' + homeimagepolicy['homeimage'];
		const homepolicyimage = './public/uploads/' + homeimagepolicy['homepolicyimage'];
		fs.unlink(homeimage, function (err) {
			if (err) {
				throw err
			} else {
				console.log("Successfully deleted the file.")
			}
		})
		fs.unlink(homepolicyimage, function (err) {
			if (err) {
				throw err
			} else {
				console.log("Successfully deleted the file.")
			}
		})
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
import { Router } from 'express';
import { ModelHomeInfo } from '../../data/homeinfo.mjs';
import { ModelMovieInfo } from '../../data/movieinfo.mjs';
import { upload } from '../../utils/multer.mjs';
// import multer from 'multer';
import fs from 'fs';
import ORM from "sequelize";
import { Console } from 'console';
// const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

router.get("/", home_page);
router.get("/home", async function (req, res) {
	return res.redirect("/");
});
router.get("/edithomedes", edithomedescription_page);
router.post("/edithomedes", edithomedescription_process);
router.get("/edithomeimagepolicy", edithomeimagepolicy_page);
router.post("/edithomeimagepolicy",
	upload.fields([
		{ name: 'homeimage', maxCount: 1 },
		{ name: 'homepolicyimage', maxCount: 1 },
	]),
	edithomeimagepolicy_process);
// router.get("/edithomebestreleases", edithomebestreleases_page);
// router.post("/edithomebestreleases", edithomebestreleases_process);

/**
 * Renders the home page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function home_page(req, res) {
	// console.log("Home page accessed");
	// let CurrentDate = new Date();
	// console.log(CurrentDate);
	// let DateDiff = [];
	// const movieinfo = await ModelMovieInfo.findAll();
	// // for (var elements in homeinfo) {
	// console.log(movieinfo);
	// // let movieupdate = movieinfo['dateUpdated'];
	// DateDiff.push(CurrentDate - movieinfo['dateUpdated']);
	// // };
	// console.log(DateDiff);

	const homeinfo = await ModelHomeInfo.findOne({
		where: {
			"homeinfo_uuid": "test"
		}
	});
	// const movieinfo = await ModelMovieInfo.findOne({
	// 	where: {
	// 		"movieinfo_uuid": "test"
	// 	}
	// });
	// console.log(role);
	// var role = roleResult(req.user.role);
	// console.log(role);

	// logout, just render index.handlebars

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
	const homedes = await ModelHomeInfo.findOne({
		where: {
			"homeinfo_uuid": "test"
		}
	});
	return res.render('admin/home/edithomedescription', { homedes: homedes });
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
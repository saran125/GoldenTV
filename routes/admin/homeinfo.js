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

	var countdown1 = "Coming Soon...";
	var countdown2 = "Coming Soon...";
	var countdown3 = "Coming Soon...";
	var countdown4 = "Coming Soon...";
	var release_img1 = "No-Image-PlaceHolder.png";
	var release_img2 = "No-Image-PlaceHolder.png";
	var release_img3 = "No-Image-PlaceHolder.png";
	var release_img4 = "No-Image-PlaceHolder.png";

	const NewestAgain = Newest.sort();

	if (NewestAgain.length != 0) {

		if (NewestAgain.length == 1) {
			countdown1 = "Out Now!";
			if (NewestAgain[0]._countdown > 0) {
				countdown1 = NewestAgain[0]._countdown;
			}
			release_img1 = NewestAgain[0]._image;
		}
		if (NewestAgain.length == 2) {
			countdown1 = "Out Now!";
			countdown2 = "Out Now!";
			if (NewestAgain[0]._countdown > 0) {
				countdown1 = NewestAgain[0]._countdown;
				countdown2 = NewestAgain[1]._countdown;
			}
			release_img1 = NewestAgain[0]._image;
			release_img2 = NewestAgain[1]._image;
		}
		if (NewestAgain.length == 3) {
			if (NewestAgain[0]._countdown > 0) {
				countdown1 = NewestAgain[0]._countdown;
				countdown2 = NewestAgain[1]._countdown;
				countdown3 = NewestAgain[2]._countdown;
			}
			else {
				countdown1 = "Out Now!";
				countdown2 = "Out Now!";
				countdown3 = "Out Now!";
			}
			release_img1 = NewestAgain[0]._image;
			release_img2 = NewestAgain[1]._image;
			release_img3 = NewestAgain[2]._image;
		}
		else {
			if (NewestAgain[0]._countdown > 0) {
				countdown1 = NewestAgain[0]._countdown;
			}
			else {
				countdown1 = "Out Now!";
			}
			if (NewestAgain[1]._countdown > 0) {
				countdown2 = NewestAgain[1]._countdown;
			}
			else {
				countdown2 = "Out Now!";
			}
			if (NewestAgain[2]._countdown > 0) {
				countdown3 = NewestAgain[2]._countdown;
			}
			else {
				countdown3 = "Out Now!";
			}
			if (NewestAgain[3]._countdown > 0) {
				countdown4 = NewestAgain[3]._countdown;
			}
			else {
				countdown4 = NewestAgain[3]._countdown;
			}
			release_img1 = NewestAgain[3]._image;
			release_img2 = NewestAgain[2]._image;
			release_img3 = NewestAgain[1]._image;
			release_img4 = NewestAgain[0]._image;
		}
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
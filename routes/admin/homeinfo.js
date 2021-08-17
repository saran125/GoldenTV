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
 * Renders the edithomedes page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here

// admin to edit
async function edithomedescription_page(req, res) {
	console.log("Home editing page accessed");
	try {
		let user = req.user.uuid;
		console.log(user);
		// check whether the user is staff or manager
		if (req.user.role == 'staff' || req.user.role == 'manager') {
			const homedes = await ModelHomeInfo.findOne({
				where: {
					"homeinfo_uuid": "test"
				}
			});

			return res.render('admin/home/edithomedescription',
				{
					homedes: homedes
				});
		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
};

/**
* Renders the login page
* @param {Request}  req Express Request handle
* @param {Response} res Express Response handle
*/

// post might be difficult to access
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

// get method.. only admins can accessed
async function edithomeimagepolicy_page(req, res, next) {
	console.log("Home Policy page accessed");
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager') {
			const homeimagepolicy = await ModelHomeInfo.findOne({
				where: {
					"homeinfo_uuid": "test"
				}
			});
			return res.render('admin/home/edithomeimagepolicy', { homeimagepolicy: homeimagepolicy });
		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// post method 
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
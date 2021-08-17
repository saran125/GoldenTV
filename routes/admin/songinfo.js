import { Router } from 'express';
import { ModelSongInfo } from '../../data/songinfo.mjs';
import { upload } from '../../utils/multer.mjs';
import fs from 'fs';
import ORM from "sequelize";
const { Op } = ORM;
const router = Router();
export default router;
import date from 'date-and-time';

router.get("/chooseeditsongstable", chooseeditsongstable);
router.get("/chooseeditsongstable-data", chooseeditsongstable_data);
router.get("/createsong", createsong_page);
router.post("/createsong",
	upload.any(),
	createsong_process);
router.get("/updatesong/:song_uuid", updatesong_page);
router.put("/updatesong/:song_uuid",
	upload.any(),
	updatesong_process);
router.get("/deletesong/:song_uuid", deletesong);

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here

// only staff or manager can access
async function chooseeditsongstable(req, res) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager') {
	return res.render('admin/songs/chooseeditsongstable');

		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
}

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditsongstable_data(req, res,next) {
	try {
		let pageSize = parseInt(req.query.limit);    //(req.query.pageSize)? req.query.pageSize : 10;
		let offset = parseInt(req.query.offset);   //page * pageSize;
		let sortBy = (req.query.sort) ? req.query.sort : "songname";
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
				"songname": { [Op.substring]: search },
				"songagerating": { [Op.substring]: search },
				"songduration": { [Op.substring]: search },
				"songgenre": { [Op.substring]: search },
				"song_uuid": { [Op.substring]: req.body.song_uuid }
			}
		} : undefined;

		const total = await ModelSongInfo.count({ where: conditions });
		const pageTotal = Math.ceil(total / pageSize);
		//	Clamp values to prevent overflow
		//page   = (page   < pageTotal)? page : pageTotal;
		//offset = (page - 1) * pageSize;

		const pageContents = await ModelSongInfo.findAll({
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
// only staff or manager can access
async function createsong_page(req, res) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager') {
	console.log("Prod List Create Songs page accessed");
	return res.render('admin/songs/createsongs', {

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
async function createsong_process(req, res) {
	try {
		var fileKeys = req.files;
		let uploadedFiles = [];
		for (let item of fileKeys) {
			console.log(item.filename);
			uploadedFiles.push(item.filename);
		}
		console.log(uploadedFiles[0]);

		const now = new Date();
		const DateNow = date.format(now, "YYYY/MM/DD HH:mm:ss");

		if (uploadedFiles.length == 1) {
			const createsongs = await ModelSongInfo.create({
				"dateCreated": DateNow,
				"dateUpdated": DateNow,
				"song_uuid": req.body.song_uuid,
				"admin_uuid": req.user.uuid,
				"songimage": String(uploadedFiles[0]),
				"songname": req.body.songname,
				"songagerating": req.body.songagerating,
				"songduration": req.body.songduration,
				"songgenre": req.body.songgenre
			});
			createsongs.save()
			console.log('Description created: $(createsongs.email)');
		}
		else {
			for (let i = 0; i < uploadedFiles.length; i++) {
				const createsongs = await ModelSongInfo.create({
					"song_uuid": req.body.song_uuid,
					"admin_uuid": req.user.uuid,
					"songimage": uploadedFiles[i],
					"songname": req.body.songname[i],
					"songagerating": req.body.songagerating[i],
					"songduration": req.body.songduration[i],
					"songgenre": req.body.songgenre[i]
				});
				console.log(createsongs);
				createsongs.save();
			}
		}
		return res.redirect("/prod/list");
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('admin/songs/createsongs');
	}
}

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here

// only staff or manager can access
async function updatesong_page(req, res) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager') {
	const tid = String(req.params.song_uuid);
	const song = await ModelSongInfo.findByPk(tid);
	console.log("Prod List RoomsInfo page accessed");
	return res.render('admin/songs/updatesong', { song: song });
}
		else { return res.render('404'); }}
	catch (error) {
	return res.render('404');
};
};

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function updatesong_process(req, res) {
	try {
		let update_songimage = {};
		const tid = String(req.params.song_uuid);
		const song = await ModelSongInfo.findByPk(tid);
		const songimage = './public/uploads/' + song['songimage'];

		if (req.file != null && typeof req.file == 'object') {
			if (Object.keys(req.file).length != 0) { //select file
				fs.unlink(songimage, function (err) {
					if (err) {
						throw err
					} else {
						console.log("Successfully deleted the file.")
					}
				})
				update_songimage.image = req.file.filename;
			}
			else {
				update_songimage.image = song.songimage; //select NO file
			}
		}
		const now = new Date();
		const DateNow = date.format(now, "YYYY/MM/DD HH:mm:ss");
		song.update({
			"dateUpdated": DateNow,
			"songimage": update_songimage.image,
			"songname": req.body.songname,
			"songagerating": req.body.songagerating,
			"songduration": req.body.songduration,
			"songgenre": req.body.songgenre
		});
		song.save();
		console.log(`Description created: $(movie.email)`);
		return res.redirect("/prod/list");
	}
	catch (error) {
		console.error(`Failed to update user ${req.body.song_uuid}`);
		const tid = String(req.params.song_uuid);
		const song = await ModelSongInfo.findByPk(tid);
		return res.render("admin/songs/updatesong", { song: song });
	}
}

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
async function deletesong(req, res, next) {
		// if (tid == undefined)
		// 	throw new HttpError(400, "Target not specified");
	try {
		const tid = String(req.params.song_uuid);
		const target = await ModelSongInfo.findByPk(tid);
		const songimage = './public/uploads/' + target['songimage'];
		fs.unlink(songimage, function (err) {
			if (err) {
				throw err
			} else {
				console.log("Successfully deleted the file.")
			}
		})
		target.destroy();
		console.log(`Deleted song: ${tid}`);
		return res.redirect("/song/chooseeditsongstable");

	}
	catch (error) {
		console.error(`Failed to delete`)
		error.code = (error.code) ? error.code : 500;
		return next(error);
	}
}
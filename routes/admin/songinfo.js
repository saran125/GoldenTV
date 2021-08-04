import { Router } from 'express';
import { ModelSongInfo } from '../../data/songinfo.mjs';
import { upload } from '../../utils/multer.mjs';
import fs from 'fs';
import ORM from "sequelize";
// const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

router.get ("/chooseeditsongstable", chooseeditsongstable);
router.get ("/chooseeditsongstable-data", chooseeditsongstable_data);
router.get("/createsong", createsong_page);
router.post("/createsong",  
upload.single('songimage'),
createsong_process);
router.get ("/updatesong/:song_uuid", updatesong_page);
router.put ("/updatesong/:song_uuid", 
upload.single('songimage'),
updatesong_process);
router.get ("/deletesong/:song_uuid", deletesong);

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditsongstable(req, res) {
	return res.render('admin/songs/chooseeditsongstable'); 
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
				"songgenre": { [Op.substring]: search }
			}
		} : undefined;

		const total        = await ModelSongInfo.count({where: conditions});
		const pageTotal    = Math.ceil(total / pageSize);
		//	Clamp values to prevent overflow
		//page   = (page   < pageTotal)? page : pageTotal;
		//offset = (page - 1) * pageSize;

		const pageContents = await ModelSongInfo.findAll({
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
async function createsong_page(req, res) {
	console.log("Prod List Create Songs page accessed");
	return res.render('admin/songs/createsongs', {

	});
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */

async function createsong_process(req, res) {
	try {
		const createsongs = await ModelSongInfo.create({
			"song_uuid": req.body.song_uuid,
			"admin_uuid": "00000000-0000-0000-0000-000000000000",
			"user_uuid" : "00000000-0000-0000-0000-000000000000",
			"songimage": req.file.filename,
			"songname": req.body.songname,
			"songagerating": req.body.songagerating,
			"songduration": req.body.songduration,
			"songgenre": req.body.songgenre
		});
		createsongs.save()
		console.log('Description created: $(createsongs.email)');
		return res.redirect("/song/chooseeditsongstable"
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
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function updatesong_page(req, res) {
	const tid = String(req.params.song_uuid);
	const song = await ModelSongInfo.findByPk(tid);
	console.log("Prod List RoomsInfo page accessed");
	return res.render('admin/songs/updatesong', 
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
		const tid = String(req.params.song_uuid);
		const song = await ModelSongInfo.findByPk(tid);
		const songimage = './public/uploads/' + song['songimage'];
		song.update({
			"songimage": req.file.filename,
			"songname": req.body.songname,
			"songagerating": req.body.songagerating,
			"songduration": req.body.songduration,
			"songgenre": req.body.songgenre
		});
		song.save();
		fs.unlink(songimage, function(err) {
			if (err) {
			  throw err
			} else {
			  console.log("Successfully deleted the file.")
			}
		  })
		console.log('Description created: $(movie.email)');
		return res.redirect("/song/chooseeditsongstable");
	}
	catch (error) {
		console.error(`Failed to update user ${req.body.song_uuid}`);
		console.error(error);
		const song  = await ModelSongInfo.findByPk(tid);
		return res.render("admin/songs/updatesong",{song:song});
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
		const tid = String(req.params.song_uuid);
		// if (tid == undefined)
		// 	throw new HttpError(400, "Target not specified");

		const target = await ModelSongInfo.findByPk(tid);
		// if (target == null)
		// 	throw new HttpError(410, "User doesn't exists");
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
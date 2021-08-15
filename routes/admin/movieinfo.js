import { Router } from 'express';
import { ModelMovieInfo } from '../../data/movieinfo.mjs';
import { upload } from '../../utils/multer.mjs';
import fs from 'fs';
import ORM from "sequelize";
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
import date from 'date-and-time';

router.get("/chooseeditmoviestable", chooseeditmoviestable);
router.get("/chooseeditmoviestable-data", chooseeditmoviestable_data);
router.get("/createmovie", createmovie_page);
router.post("/createmovie",
	upload.single('movieimage'),
	createmovie_process);

router.get("/updatemovie/:movie_uuid", updatemovie_page);
router.put("/updatemovie/:movie_uuid",
	upload.single('movieimage'),
	updatemovie_process);
router.get("/deletemovie/:movie_uuid", deletemovie);

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditmoviestable(req, res) {
	return res.render('admin/movies/chooseeditmoviestable');
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
		let pageSize = parseInt(req.query.limit);    //(req.query.pageSize)? req.query.pageSize : 10;
		let offset = parseInt(req.query.offset);   //page * pageSize;
		let sortBy = (req.query.sort) ? req.query.sort : "moviename";
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
				"moviename": { [Op.substring]: search },
				"movieagerating": { [Op.substring]: search },
				"movieduration": { [Op.substring]: search },
				"moviegenre": { [Op.substring]: search },
				"movie_uuid": { [Op.substring]: req.body.movie_uuid }
			}
		} : undefined;

		const total = await ModelMovieInfo.count({ where: conditions });
		const pageTotal = Math.ceil(total / pageSize);
		//	Clamp values to prevent overflow
		//page   = (page   < pageTotal)? page : pageTotal;
		//offset = (page - 1) * pageSize;

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
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function createmovie_page(req, res) {
	console.log("Prod List Choose Edit Movie page accessed");
	return res.render('admin/movies/createmovies', {

	});
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function createmovie_process(req, res, next) {
	try {
		const start = new Date(req.body.moviereleasedate);
		const end = new Date(req.body.movieenddate);
		
		const startDate = date.format(start, 'MMM DD, YYYY HH:mm:ss');
		const endDate = date.format(end, 'MMM DD, YYYY HH:mm:ss');

		// const movieimageFile = req.file[0];
		const createmovies = await ModelMovieInfo.create({
			"movie_uuid": req.body.movie_uuid,
			"admin_uuid": req.user.uuid,

			"moviereleasedate": startDate,
			"movieenddate": endDate,

			"movieimage": req.file.filename,
			"moviename": req.body.moviename,
			"movieagerating": req.body.movieagerating,
			"movieduration": req.body.movieduration,
			"moviegenre": req.body.moviegenre
		});
		console.log('Description created: $(createmovies.email)');
		createmovies.save();
		return res.redirect("/movie/chooseeditmoviestable");
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('admin/movies/createmovies',
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
async function updatemovie_page(req, res) {
	const tid = String(req.params.movie_uuid);
	const movie = await ModelMovieInfo.findByPk(tid);
	console.log("Prod List RoomsInfo page accessed");
	return res.render('admin/movies/updatemovie',
		{ movie: movie }
	);
};

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function updatemovie_process(req, res) {
	try {
		let update_image = {};
		const tid = String(req.params.movie_uuid);
		const movie = await ModelMovieInfo.findByPk(tid);
		const movieimage = './public/uploads/' + movie['movieimage'];

		if (req.file != null && typeof req.file == 'object') {
			if (Object.keys(req.file).length != 0) { //select file
				fs.unlink(movieimage, function (err) {
					if (err) {
						throw err
					} else {
						console.log("Successfully deleted the file.")
					}
				})
				update_image.image = req.file.filename;
			}
			else {
				update_image.image = movie.movieimage; //select NO file
			}
		}
		movie.update({
			"admin_uuid": req.user.uuid,
			"moviecountdown": req.body.moviecountdown,
			"movieimage": update_image.image,
			"moviename": req.body.moviename,
			"movieagerating": req.body.movieagerating,
			"movieduration": req.body.movieduration,
			"moviegenre": req.body.moviegenre
		});
		movie.save();
		return res.redirect("/movie/chooseeditmoviestable");
	}
	catch (error) {
		console.error(`Failed to update user ${req.body.movie_uuid}`);
		// console.error(error);
		// const movieimage = './public/uploads/' + movie['movieimage'];
		// fs.unlink(movieimage, function(err) {
		// 	if (err) {
		// 	  throw err
		// 	} else {
		// 	  console.log("Successfully deleted the file.")
		// 	}
		//   })
		// const movie  = await ModelMovieInfo.findByPk(tid);
		// const movie = await ModelMovieInfo.findByPk(tid);
		return res.render("admin/movies/updatemovie");
	}
}

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
async function deletemovie(req, res, next) {
	try {
		const tid = String(req.params.movie_uuid);
		// if (tid == undefined)
		// 	throw new HttpError(400, "Target not specified");
		const target = await ModelMovieInfo.findByPk(tid);
		// movieimage = target.movieimage
		// if (target == null)
		// 	throw new HttpError(410, "User doesn't exists");
		target.destroy();
		console.log(`Deleted movie: ${tid}`);
		return res.redirect("/movie/chooseeditmoviestable");
	}
	catch (error) {
		console.error(`Failed to delete`)
		error.code = (error.code) ? error.code : 500;
		return next(error);
	}
}

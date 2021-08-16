import { Router } from 'express';
import { ModelMovieInfo } from '../../data/movieinfo.mjs';
import { upload } from '../../utils/multer.mjs';
import fs from 'fs';
import ORM from "sequelize";
const { Op } = ORM;
const router = Router();
export default router;
import date from 'date-and-time';

//STAFF
router.get("/chooseeditmoviestable", chooseeditmoviestable);
router.get("/chooseeditmoviestable-data", chooseeditmoviestable_data);
router.get("/createmovie", createmovie_page);
router.post("/createmovie",
	upload.any(),
	createmovie_process);

router.get("/updatemovie/:movie_uuid", updatemovie_page);
router.put("/updatemovie/:movie_uuid",
	upload.any(),
	updatemovie_process);
router.get("/deletemovie/:movie_uuid", deletemovie);

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here

// only manager or staff can access 
async function chooseeditmoviestable(req, res) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager') {
	return res.render('admin/movies/chooseeditmoviestable');
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

// only staff or manager can access
async function createmovie_page(req, res) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager') {
	console.log("Prod List Choose Edit Movie page accessed");
	return res.render('admin/movies/createmovies');
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
async function createmovie_process(req, res, next) {
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

		const start = new Date(req.body.moviereleasedate);
		const end = new Date(req.body.movieenddate);

		const startDate = date.format(start, "YYYY/MM/DD HH:mm:ss");
		const endDate = date.format(end, "YYYY/MM/DD HH:mm:ss");

		if (uploadedFiles.length == 1) {
			// const movieimageFile = req.file[0];
			const createmovies = await ModelMovieInfo.create({
				"dateCreated": DateNow,
				"dateUpdated": DateNow,
				"movie_uuid": req.body.movie_uuid,
				"admin_uuid": req.user.uuid,
				"moviereleasedate": startDate,
				"movieenddate": endDate,
				"movieimage": String(uploadedFiles[0]),
				"moviename": req.body.moviename,
				"movieagerating": req.body.movieagerating,
				"movieduration": req.body.movieduration,
				"moviegenre": req.body.moviegenre
			});
			console.log('Description created: $(createmovies.email)');
			createmovies.save();
		}
		else {
			for (let i = 0; i < uploadedFiles.length; i++) {
				const createmovies = await ModelMovieInfo.create({
					"movie_uuid": req.body.movie_uuid,
					"admin_uuid": req.user.uuid,
					"moviereleasedate": date.format(new Date(req.body.moviereleasedate[i]), "YYYY/MM/DD HH:mm:ss"),
					"movieenddate": date.format(new Date(req.body.movieenddate[i]), "YYYY/MM/DD HH:mm:ss"),
					"movieimage": uploadedFiles[i],
					"moviename": req.body.moviename[i],
					"movieagerating": req.body.movieagerating[i],
					"movieduration": req.body.movieduration[i],
					"moviegenre": req.body.moviegenre[i]
				});
				console.log(createmovies);
				createmovies.save();
			}
		}
		return res.redirect("/prod/list");
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('admin/movies/createmovies');
	}
}

/**
 * Renders the edithomebestreleases page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here

// only staff or admin can access
async function updatemovie_page(req, res) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager') {
	const tid = String(req.params.movie_uuid);
	const movie = await ModelMovieInfo.findByPk(tid);
	console.log("Prod List RoomsInfo page accessed");
	// "2021-08-29T02:09"
	const start = new Date(movie.moviereleasedate);
	const end = new Date(movie.movieenddate);

	const startDate = date.format(start, 'YYYY-MM-DDTHH:mm');
	const endDate = date.format(end, 'YYYY-MM-DDTHH:mm');

	return res.render('admin/movies/updatemovie',
		{
			movie: movie,
			moviestartdate: startDate,
			movieenddate: endDate
		}
	);
	}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
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

		const start = new Date(req.body.moviereleasedate);
		const end = new Date(req.body.movieenddate);

		const startDate = date.format(start, 'MMM DD, YYYY HH:mm:ss');
		const endDate = date.format(end, 'MMM DD, YYYY HH:mm:ss');

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
		const now = new Date();
		const DateNow = date.format(now, "YYYY/MM/DD HH:mm:ss");
		movie.update({
			"dateUpdated": DateNow,
			"admin_uuid": req.user.uuid,
			"moviereleasedate": startDate,
			"movieenddate": endDate,
			"movieimage": update_image.image,
			"moviename": req.body.moviename,
			"movieagerating": req.body.movieagerating,
			"movieduration": req.body.movieduration,
			"moviegenre": req.body.moviegenre
		});
		movie.save();
		return res.redirect("/prod/list");
	}
	catch (error) {
		const tid = String(req.params.movie_uuid);
		const movie = await ModelMovieInfo.findByPk(tid);
		console.log("Prod List RoomsInfo page accessed");
		// "2021-08-29T02:09"
		const start = new Date(movie.moviereleasedate);
		const end = new Date(movie.movieenddate);
	
		const startDate = date.format(start, 'YYYY-MM-DDTHH:mm');
		const endDate = date.format(end, 'YYYY-MM-DDTHH:mm');
		console.log(error);
		return res.render("admin/movies/updatemovie",
		{
			movie: movie,
			moviestartdate: startDate,
			movieenddate: endDate
		});
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
		const target = await ModelMovieInfo.findByPk(tid);
		const movieimage = './public/uploads/' + target['movieimage'];
		fs.unlink(movieimage, function (err) {
			if (err) {
				throw err
			} else {
				console.log("Successfully deleted the file.")
			}
		})
		target.destroy();
		console.log(`Deleted movie: ${tid}`);
		return res.redirect("/prod/list");
	}
	catch (error) {
		console.error(`Failed to delete`)
		error.code = (error.code) ? error.code : 500;
		return next(error);
	}
}

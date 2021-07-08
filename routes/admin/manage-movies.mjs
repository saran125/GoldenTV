import { Router }                 from 'express';
import { Op }                     from '../data/database.mjs';
import { ModelMovies, UserRole }    from '../../data/user.mjs';
// import { HttpError }              from '../../utils/errors.mjs';
// import { UploadProfileImage, DeleteFilePath }     from '../../utils/multer.mjs';
const router = Router();
export default router;

router.get("/api/list", api_list);
// router.get ("/axios-test",  example_axios);
// router.get ("/prodlist/chooseeditmoviestable", chooseeditmoviestable);
// router.get ("/prodlist/chooseeditmoviestable-data", chooseeditmoviestable_data);

/**
 * Returns a JSON for bootstrap-table to render with
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
 async function api_list(req, res, next) {
	try{ 
		let pageSize  = parseInt(req.query.limit);    //(req.query.pageSize)? req.query.pageSize : 10;
		let offset    = parseInt(req.query.offset);   //page * pageSize;
		let sortBy    = (req.query.sort)?   req.query.sort  : "dateCreated";
		let sortOrder = (req.query.order)?  req.query.order : "desc";
		let search    = req.query.search;

		//if (page < 0)     throw new HttpError(400, "Invalid page number");
		if (pageSize < 0) throw new HttpError(400, "Invalid page size");
		if (offset < 0)   throw new HttpError(400, "Invalid offset index");

		// const choosemovies = await ModelMovies.findAll({
		// 	raw: true
		// 	// where:{
		// 	// 	// "email" : "root@mail.com"
		// 	// 	"movieimage"    :  { [Op.ne]: "null" }, 
		// 	// 	"moviename"     :  { [Op.ne]: "null" }, 
		// 	// 	"movieagerating":  { [Op.ne]: "null" }, 
		// 	// 	"movieduration" :  { [Op.ne]: "null" } 
		// 	// 	// "moviegenres"   :  { [Op.substring]: search }
		// 	// }
		// });

        /** @type {import('sequelize/types').WhereOptions} */
		const conditions   = (search) ? {
			[Op.or]: {
				"movieimage"	: { [Op.substring]: search }, 
				"moviename"		: { [Op.substring]: search },
				"movieagerating": { [Op.substring]: search }, 
				"movieduration" : { [Op.substring]: search } 
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

		return res.json({
			"total": total,
			"rows":  pageContents
		});

		// return res.render('chooseeditmoviestable',{
		// 	choosemovies:  choosemovies
		// });
	}
	catch (error) {
		console.error(`Request query errors`);
		console.error(error);
		return next(new HttpError(400, error.message));
	}
}
import { Router } from 'express';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { upload } from '../../utils/multer.mjs';
import fs from 'fs';
import ORM from "sequelize";
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

router.get("/chooseeditroomstable", chooseeditroomstable);
router.get("/chooseeditroomstable-data", chooseeditroomstable_data);
router.get("/createrooms", createroom_page);
router.post("/createrooms",
	upload.single('roomimage'),
	createroom_process);
router.get("/updateroom/:room_uuid", updateroom_page);
router.put("/updateroom/:room_uuid",
	upload.single('roomimage'),
	updateroom_process);

router.get("/deleteroom/:room_uuid", deleteroom);

// router.get("/editroominfo", editrooms_page);
// router.post("/editroominfo", 
// upload.fields([
//     { name: 'roomimage', maxCount: 1 },
// 	// { name: 'med_roomimage', maxCount: 1 },
//     // { name: 'large_roomimage', maxCount: 1 }
//   ]),
// editrooms_process);

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditroomstable(req, res) {
	return res.render('admin/rooms/chooseeditroomstable');
}

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditroomstable_data(req, res) {
	console.log("hello you are chooseeditriimstable")
	try {
		let pageSize = parseInt(req.query.limit);    //(req.query.pageSize)? req.query.pageSize : 10;
		let offset = parseInt(req.query.offset);   //page * pageSize;
		let sortBy = (req.query.sort) ? req.query.sort : "dateCreated";
		let sortOrder = (req.query.order) ? req.query.order : "desc";
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
				"roomname": { [Op.substring]: search },
				"roomsize": { [Op.substring]: search },
				"roomprice": { [Op.substring]: search },
				"roominfo": { [Op.substring]: search },
				"roomprice": { [Op.substring]: search },
				"roomimage": { [Op.substring]: search },
                "location": { [Op.substring]: search }
			}
		} : undefined;

		const total = await ModelRoomInfo.count({ where: conditions });
		const pageTotal = Math.ceil(total / pageSize);
		//	Clamp values to prevent overflow
		//page   = (page   < pageTotal)? page : pageTotal;
		//offset = (page - 1) * pageSize;

		const pageContents = await ModelRoomInfo.findAll({
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
async function createroom_page(req, res) {
	console.log("Prod List Choose Edit Movie page accessed");
	return res.render('admin/rooms/createrooms', {

	});
};

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function createroom_process(req, res, next) {
	try {
		// const movieimageFile = req.file[0];
		const createrooms = await ModelRoomInfo.create({
			"roominfo_uuid": req.body.roominfo_uuid,
			"admin_uuid": "00000000-0000-0000-0000-000000000000",
			// "user_uuid": "00000000-0000-0000-0000-000000000000",
			"roomimage": req.file.filename,
			"roomname": req.body.roomname,
            "roomsize": req.body.roomsize,
			"roomprice": req.body.roomprice,
			"roominfo": req.body.roominfo,
			"location": req.body.location

			// "movieHorror": Boolean(req.body.movieHorror),
			// "movieComedy": Boolean(req.body.movieComedy),
			// "movieScience": Boolean(req.body.movieScience),
			// "movieRomance": Boolean(req.body.movieRomance),
			// "movieAnimation": Boolean(req.body.movieAnimation),
			// "movieAdventure": Boolean(req.body.movieAdventure),
			// "movieEmotional": Boolean(req.body.movieEmotional),
			// "movieMystery": Boolean(req.body.movieMystery),
			// "movieAction": Boolean(req.body.movieAction)			
		});
		console.log('Description created: $(createrooms.email)');
		createrooms.save();
		return res.redirect("/rooms/chooseeditroomstable"
			// , { email: email }
		);
	}
	catch (error) {
		console.error(`Credentials problem: ${req.body.email}`);
		console.error(error);
		return res.render('admin/rooms/createrooms',
			// { errors: errors }
		);
	}
}

/**
 * 
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function updateroom_page(req, res) {
    console.log("Option page accessed");
    return res.render('admin/option');
}

/**
 * 
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function updateroom_process(req, res) {
    // console.log('Description created: $(booking.choice)');
    try {
        console.log(req.body);
        for (let i = 0; i < req.body.location.length; i++) {
            const option = await ModelRoomInfo.create({
                roomname: req.body.roomname[i],
                roomsize: req.body.roomsize[i],
                roomprice: req.body.roomprice[i],
                roominfo: req.body.roominfo[i],
                roomimage: req.body.roomimage[i],
                location: req.body.location[i].toUpperCase(),
                admin_uuid: req.user.uuid
            });
            console.log(option);
        }
        return res.redirect("/admin/viewoption");
    }
    catch (error) {
        console.error(error);
    }
}

// /**
//  * Renders the edithomebestreleases page
//  * @param {Request}  req Express Request handle
//  * @param {Response} res Express Response handle
//  */
// // ---------------- 
// //	TODO:	Common URL paths here
// async function editrooms_page(req, res) {
// 	const roomlist = await ModelRoomInfo.findOne({
// 		where: {
// 			"roominfo_uuid": "test"
// 		}
// 	});
// 	console.log("Prod List RoomsInfo page accessed");
// 	return res.render('admin/rooms/editrooms', { roomlist: roomlist	});
// };

// /**
//  * Renders the login page
//  * @param {Request}  req Express Request handle
//  * @param {Response} res Express Response handle
//  */
// async function editrooms_process(req, res, next) {
// 	try {
// 		const roomimageFile = req.files.roomimage[0];
// 		// const med_roomimageFile   = req.files.med_roomimage[0];
// 		// const large_roomimageFile = req.files.large_roomimage[0];

// 		const roomlist = await ModelRoomInfo.findOne({
// 			where: {
// 				"roominfo_uuid": "test"
// 			}
// 		});
// 		const roomimage = './public/uploads/' + roomlist['roomimage'];
// 		// const med_roomimage = './public/uploads/' + roomlist['med_roomimage'];
// 		// const large_roomimage = './public/uploads/' + roomlist['large_roomimage'];

// 		roomlist.update({
// 			// "room_title": req.body.room_title,
// 			"roominfo": req.body.roominfo,
// 			"roomprice": req.body.roomprice,
// 			"roomimage": roomimageFile.filename,
// 			// "med_roominfo": req.body.med_roominfo,
// 			// "med_roomprice": req.body.med_roomprice,
// 			// "med_roomimage": med_roomimageFile.filename,
// 			// "large_roominfo": req.body.large_roominfo,
// 			// "large_roomprice": req.body.large_roomprice,
// 			// "large_roomimage": large_roomimageFile.filename,
// 		})
// 		roomlist.save();
// 		fs.unlink(roomimage, function(err) {
// 			if (err) { throw err } 
// 			else {
// 				console.log("Successfully deleted the file.")
// 				// fs.unlink(med_roomimage, function(err) {
// 				// 	if (err) { throw err } 
// 				// 	else {
// 				// 		console.log("Successfully deleted the file.")
// 				// 		fs.unlink(large_roomimage, function(err) {
// 				// 			if (err) { throw err } 
// 				// 			else { console.log("Successfully deleted the file.") }
// 				// 			})
// 				// 		}
// 				// 	})
					
// 				}
// 		})
// 		console.log('Description created: $(roomlist.email)');
// 		return res.redirect("/prod/list");
// 	}
// 	catch (error) {
// 		console.error(`Credentials problem: ${req.body.email}`);
// 		console.error(error);
// 		return res.render('admin/rooms/editrooms');
// 	}
// }

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
 async function deleteroom(req, res, next) {
	try {
		const tid = String(req.params.room_uuid);
		// if (tid == undefined)
		// 	throw new HttpError(400, "Target not specified");
		const target = await ModelRoomInfo.findByPk(tid);
		// movieimage = target.movieimage
		// if (target == null)
		// 	throw new HttpError(410, "User doesn't exists");
		target.destroy();
		console.log(`Deleted movie: ${tid}`);
		return res.redirect("/rooms/chooseeditroomstable");
	}
	catch (error) {
		console.error(`Failed to delete`)
		error.code = (error.code) ? error.code : 500;
		return next(error);
	}
}
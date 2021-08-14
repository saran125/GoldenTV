import { Router } from 'express';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { upload } from '../../utils/multer.mjs';
import fs from 'fs';
import ORM from "sequelize";
import date from 'date-and-time';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

//CUSTOMER
router.get("/list", viewrooms);

//ADMIN
router.get("/chooseeditroomstable", chooseeditroomstable);
router.get("/chooseeditroomstable-data", chooseeditroomstable_data);
router.get("/createrooms", createroom_page);
router.post("/createrooms",
	upload.any(),
	createroom_process);
router.get("/updateroom/:room_uuid", updateroom_page);
router.put("/updateroom/:room_uuid",
	upload.any(),
	updateroom_process);
router.get("/deleteroom/:room_uuid", deleteroom);
router.get("/ticket/:room_uuid", ticket_detail);

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
async function viewrooms(req, res) {
	console.log("Rooms Data Table accessed");
	return res.render('roomlist');
}

/**
 * Provide Bootstrap table with data
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
// ---------------- 
//	TODO:	Common URL paths here
async function chooseeditroomstable(req, res) {
	console.log("Rooms Data Table accessed");
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
	try {
		let pageSize = parseInt(req.query.limit);    //(req.query.pageSize)? req.query.pageSize : 10;
		let offset = parseInt(req.query.offset);   //page * pageSize;
		let sortBy = (req.query.sort) ? req.query.sort : "location";
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
				"roomname": { [Op.substring]: search },
				"roomsize": { [Op.substring]: search },
				"roomprice": { [Op.substring]: search },
				"roominfo": { [Op.substring]: search },
				"roomprice": { [Op.substring]: search },
				"roomimage": { [Op.substring]: search },
				"location": { [Op.substring]: search },
				// "admin_id": { [Op.substring]: req.user.uuid },
				"room_uuid": { [Op.substring]: req.body.room_uuid }
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
	console.log("Add Rooms page accessed");
	return res.render('admin/rooms/createrooms');
}

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function createroom_process(req, res, next) {
	try {
		var fileKeys = req.files;
		let uploadedFiles = [];
		for (let item of fileKeys) {
			console.log(item.filename);
			uploadedFiles.push(item.filename);
		}
		console.log(uploadedFiles[0]);
		// console.log(fileKeys.filename);

		if (uploadedFiles.length == 1) {
			const option = await ModelRoomInfo.create({
				admin_uuid: req.user.uuid,
				roomname: req.body.roomname,
				roomsize: req.body.roomsize,
				roomprice: req.body.roomprice,
				roominfo: req.body.roominfo,
				roomimage: String(uploadedFiles[0]),
				location: req.body.location.toUpperCase(),
				room_uuid: req.body.room_uuid
			});
			console.log(option);
			option.save();
		}
		else {
			for (let i = 0; i < uploadedFiles.length; i++) {
				const option = await ModelRoomInfo.create({
					roomname: req.body.roomname[i],
					roomsize: req.body.roomsize[i],
					roomprice: req.body.roomprice[i],
					roominfo: req.body.roominfo[i],
					roomimage: uploadedFiles[i],
					location: req.body.location[i].toUpperCase(),
					room_uuid: req.body.room_uuid
				});
				console.log(option);
				option.save();
			}
		}
		return res.redirect("/room/chooseeditroomstable");
	}
	catch (error) {
		console.error(error);
	}
}

/**
 * 
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function updateroom_page(req, res) {
	// const tid = String(req.params.room_uuid);
	const room = await ModelRoomInfo.findOne({
		where: {
			room_uuid: req.params.room_uuid
		}
	});
	console.log("Update Rooms accessed");
	return res.render('admin/rooms/updaterooms', { room: room });
}

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function updateroom_process(req, res) {
	console.log("Update Room page accessed");
	try {
		let update_roomimage = {};
		const tid = String(req.params.room_uuid);
		const room = await ModelRoomInfo.findByPk(tid);
		const roomimage = './public/uploads/' + room['roomimage'];

		if (req.file != null && typeof req.file == 'object') {
			if (Object.keys(req.file).length != 0) { //select file
				fs.unlink(roomimage, function (err) {
					if (err) {
						throw err
					} else {
						console.log("Successfully deleted the file.");
					}
				})
				update_roomimage.image = req.file.filename;
			}
			else {
				update_roomimage.image = room.roomimage; //select NO file
			}
		}
		// const now = new Date("Jan 5, 2022 15:37:25").getTime();

		// const now = new Date("Jan 5, 2022 15:37:25");

		const now = new Date();
		const DateNow = date.format(now, 'MMM DD, YYYY HH:mm:ss');
		// const DateAgain = new Date(DateNow);
		// const Prev = new Date(room.dateUpdated);

		// const DateNow = date.format(now, 'YYYY/MM/DD HH:mm:ss');
		// const DateAgain = new Date(DateNow);
		// const Prev = new Date(room.dateUpdated);
		// const DateNow = date.format(now, 'DD/MM/YYYY HH:mm:ss');
		// "dateUpdated": String(date.subtract(DateNow, Date.parse(room.dateCreated)).toHours()),
		// new Date(room.dateCreated)
		room.update({
			"dateUpdated": DateNow,
			"admin_uuid": req.user.uuid,
			"roomname": req.body.roomname,
			"roomsize": req.body.roomsize,
			"roomprice": req.body.roomprice,
			"roominfo": req.body.roominfo,
			"roomimage": update_roomimage.image,
			"location": req.body.location.toUpperCase()
		});
		room.save();
		console.log('Description created: $(room.roomname)');

		// const MonthPrev = parseInt(String(DatePrev[5] + DatePrev[6]));
		// const DayPrev = parseInt(String(DatePrev[8] + DatePrev[9]));
		// const HoursPrev = parseInt(String(DatePrev[11] + DatePrev[12]));
		// const MinutesPrev = parseInt(String(DatePrev[14] + DatePrev[15]));
		// const SecondsPrev = parseInt(String(DatePrev[17] + DatePrev[18]));

		// const MonthNow = parseInt(String(DateNow[5] + DateNow[6]));
		// const DayNow = parseInt(String(DateNow[8] + DateNow[9]));
		// const HoursNow = parseInt(String(DateNow[11] + DateNow[12]));
		// const MinutesNow = parseInt(String(DateNow[14] + DateNow[15]));
		// const SecondsNow = parseInt(String(DateNow[17] + DateNow[18]));

		// console.log(MonthNow - MonthPrev);
		// console.log(Day - DayPrev);
		// console.log(Hours - HoursPrev);
		// console.log(Minutes - MinutesPrev);
		// console.log(60 - Seconds);

		return res.redirect("/room/chooseeditroomstable");
	}
	catch (error) {
		console.error(`Failed to update user ${req.body.room_uuid}`);
		console.log(error);
		const tid = String(req.params.room_uuid);
		const room = await ModelRoomInfo.findByPk(tid);
		return res.render('admin/rooms/updaterooms', { room: room });
	}
}


/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
async function deleteroom(req, res, next) {
	try {
		const tid = String(req.params.room_uuid);
		const target = await ModelRoomInfo.findByPk(tid);
		target.destroy();
		console.log(`Deleted movie: ${tid}`);
		return res.redirect("/room/chooseeditroomstable");
	}
	catch (error) {
		console.error(`Failed to delete`)
		error.code = (error.code) ? error.code : 500;
		return next(error);
	}
}
async function ticket_detail(req, res) {
	// console.log('Description created: $(booking.choice)');
	try {
		console.log(req.params);
		const ticket = await ModelRoomInfo.findOne({
			where: {
				room_uuid: req.params.room_uuid
			}
		});
		return res.render('admin/ticket', { ticket });
	}
	catch (error) {
		console.error(error);
	}
}
// }


// /**
//  * Deletes a specific user
//  * @param {import('express').Request} req 
//  * @param {import('express').Response} res 
//  * @param {import('express').NextFunction} next
//  */
//  async function deleteroom(req, res, next) {
// 	try {
// 		const tid = String(req.params.room_uuid);
// 		// if (tid == undefined)
// 		// 	throw new HttpError(400, "Target not specified");
// 		const target = await ModelRoomInfo.findByPk(tid);
// 		// movieimage = target.movieimage
// 		// if (target == null)
// 		// 	throw new HttpError(410, "User doesn't exists");
// 		target.destroy();
// 		console.log(`Deleted movie: ${tid}`);
// 		return res.redirect("/rooms/chooseeditroomstable");
// 	}
// 	catch (error) {
// 		console.error(`Failed to delete`)
// 		error.code = (error.code) ? error.code : 500;
// 		return next(error);
// 	}
// }

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
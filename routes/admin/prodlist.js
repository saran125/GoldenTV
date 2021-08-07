import { Router } from 'express';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { ModelMovieInfo } from '../../data/movieinfo.mjs';
import { ModelSongInfo } from '../../data/songinfo.mjs';
import { upload } from '../../utils/multer.mjs';
// import multer from 'multer';
import fs from 'fs';
import ORM from "sequelize";
// const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

router.get("/list", prodlist_page);

/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
// ---------------- 
//	TODO:	Common URL paths here
async function prodlist_page(req, res) {
	// const roomlist = await ModelRoomInfo.findOne({
	// 	where: {
	// 		"roominfo_uuid": "test"
	// 	}
	// });
	// const movies = await ModelMovieInfo.findOne({
	// 	where: {
	// 		"movie_uuid": "test"
	// 	}
	// });
	const songs = await ModelSongInfo.findOne({
		where: {
			"song_uuid": "test"
		}
	});
	console.log('Prodlist Page accessed');
	return res.render('prodlist', {
		// room_title: roomlist.room_title,
		// small_roominfo: roomlist.small_roominfo,
		// small_roomprice: roomlist.small_roomprice,
		// small_roomimage: roomlist.small_roomimage,
		// med_roominfo: roomlist.med_roominfo,
		// med_roomprice: roomlist.med_roomprice,
		// med_roomimage: roomlist.med_roomimage,
		// large_roominfo: roomlist.large_roominfo,
		// large_roomprice: roomlist.large_roomprice,
		// large_roomimage: roomlist.large_roomimage,
		movieimage: req.body.movieimage,
		moviename: req.body.moviename,
		movieagerating: req.body.movieagerating,
		movieduration: req.body.movieduration,
		movieHorror: req.body.movieHorror,
		movieComedy: req.body.movieComedy,
		movieScience: req.body.movieScience,
		movieRomance: req.body.movieRomance,
		movieAnimation: req.body.movieAnimation,
		movieAdventure: req.body.movieAdventure,
		movieEmotional: req.body.movieEmotional,
		movieMystery: req.body.movieMystery,
		movieAction: req.body.movieAction,
		songimage: req.body.songimage,
		songname: "songname",
		songagerating: "songagerating",
		songduration: "songduration",
		songPop: req.body.songPop,
		songRock: req.body.songRock,
		songMetal: req.body.songMetal,
		songCountry: req.body.songCountry,
		songRap: req.body.songRap,
		songJazz: req.body.songJazz,
		songFolk: req.body.songFolk
	});
}

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
	console.log('Prodlist Page accessed');
	return res.render('prodlist');
}

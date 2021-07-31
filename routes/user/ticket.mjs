import { Router } from 'express';
import { nanoid } from 'nanoid'
import { Modelticket } from '../../data/ticket.mjs';
import {Modelroomtype} from "../../data/roomtype.mjs"
import ORM from "sequelize";
import qr from 'qrcode';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
router.get("/ticketlist", tickettable);
router.get("/tickettable-data", tickettable_data);
async function tickettable(req, res) {
    console.log(req.user.uuid);
    return res.render('user/tickets');
};
async function tickettable_data(req, res) {
    let pageSize = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let sortBy = req.query.sort ? req.query.sort : "date";
    let sortOrder = req.query.order ? req.query.order : "asc";
    let search = req.query.search;
    if (pageSize < 0) {
        throw new HttpError(400, "Invalid page size");
    }
    if (offset < 0) {
        throw new HttpError(400, "Invalid offset index");
    }
    /** @type {import('sequelize/types').WhereOptions} */
    const conditions = search
        ? {
            [Op.or]: {
                location: { [Op.substring]: search },
                time: { [Op.substring]: search },
                date: { [Op.substring]: search },
                choice: { [Op.substring]: search },
                "user_id": { [Op.substring]: req.user.uuid}
            },
        }
        : undefined;
    const total = await Modelroomtype.count({
        where: search
            ? {
                [Op.or]: {
                    location: { [Op.substring]: search },
                    time: { [Op.substring]: search },
                    date: { [Op.substring]: search },
                    choice: { [Op.substring]: search },
                    "user_id": { [Op.substring]: req.user.uuid }
                },
            } : undefined,
        where: { "user_id": req.user.uuid }});
    const pageTotal = Math.ceil(total / pageSize);

    const pageContents = await Modelroomtype.findAll({
        offset: offset,
        limit: pageSize,
        order: [[sortBy, sortOrder.toUpperCase()]],
        where: search
            ? {
                [Op.or]: {
                    location: { [Op.substring]: search },
                    time: { [Op.substring]: search },
                    date: { [Op.substring]: search },
                    choice: { [Op.substring]: search },
                },
            } : undefined,
        where: {"user_id": req.user.uuid },
        raw: true, // Data only, model excluded
    });
    return res.json({
        total: total,
        rows: pageContents,
    });
}
router.get("/view/:uuid", async function (req, res, next) {
    const tid = req.params.uuid;
    console.log("ticket page accessed");
    try {
        if (tid == undefined) {
            throw new HttpError(400, "Target user id is invalid");
        }
        const target_user = await Modelroomtype.findOne({
            where: {
                roomtype_id: tid
            }
        }); 
        const url = "roomtype id: "+ target_user.roomtype_id +"\
        Location: "+ target_user.location+"\
        time: "+ target_user.time+"\
        date: "+ target_user.date +"\
        roomtype: "+ target_user.roomtype +"\
        price: "+ target_user.price;
       
        if (target_user == null) {
            throw new HttpError(410, "User doesn't exists");
        }
        console.log(target_user);
        qr.toDataURL(url, (err, src) => {
            if (err) res.send("Error occured");
            console.log(src);
           return res.render("user/view", {
            target: target_user, src})
        });
        
    }
    catch (error) {
        console.error(`Invalid request: ${tid}`);
        error.code = (error.code == undefined) ? 500 : error.code;
        console.log(error);
        return next(error);
    }
});
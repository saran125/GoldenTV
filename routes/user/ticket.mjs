import { Router } from 'express';
import { nanoid } from 'nanoid'
import ORM from "sequelize";
import qr from 'qrcode';
import { Modelticket } from '../../data/tickets.mjs';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
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
                time: { [Op.substring]: search },
                date: { [Op.substring]: search },
                choice: { [Op.substring]: search },
                "user_id": { [Op.substring]: req.user.uuid}
            },
        }
        : undefined;
    const total = await Modelticket.count({
        where: search
            ? {
                [Op.or]: {
                    time: { [Op.substring]: search },
                    date: { [Op.substring]: search },
                    choice: { [Op.substring]: search },
                    "user_id": { [Op.substring]: req.user.uuid }
                },
            } : undefined,
        where: { "user_id": req.user.uuid }});
    const pageTotal = Math.ceil(total / pageSize);

    const pageContents = await Modelticket.findAll({
        offset: offset,
        limit: pageSize,
        order: [[sortBy, sortOrder.toUpperCase()]],
        where: search
            ? {
                [Op.or]: {
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
router.get("/view/:uuid/:room_id", async function (req, res, next) {
    const tid = req.params.uuid;
    console.log("ticket page accessed");
    try {
        if (tid == undefined) {
            throw new HttpError(400, "Target user id is invalid");
        }
        const target_user = await Modelticket.findOne({
            where: {
                ticket_id: tid
            }
        });
        const room = await ModelRoomInfo.findOne({
            where: {
                room_uuid: req.params.room_id
            }
        });

        const url = "roomtype id: "+ target_user.room_id +"\
        Location: "+ room.location+"\
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
           return res.render("user/view", {
            target: target_user, room:room, src})
        });
        
    }
    catch (error) {
        console.error(`Invalid request: ${tid}`);
        error.code = (error.code == undefined) ? 500 : error.code;
        console.log(error);
        return next(error);
    }
});
router.post("/delete/:room_id/:uuid", async function (req, res) {
    console.log("tickets deleted")
    console.log(req.body);
    Modelticket.findOne({
        where: {
            uuid: req.params.uuid
        },
    }).then((option) => {
        if (option != null) {
            Modelticket.destroy({
                where: {
                    uuid: req.params.uuid
                }

            })
            return res.redirect("/room/ticket/"+req.params.room_id);
        }

    });
});
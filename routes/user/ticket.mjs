import { Router } from 'express';
import { nanoid } from 'nanoid'
import { Modelticket } from '../../data/ticket.mjs';
import ORM from "sequelize";
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
router.get("/ticketlist", tickettable);
router.get("/tickettable-data", tickettable_data);
async function tickettable(req, res) {
    return res.render('user/tickets');
}
async function tickettable_data(req, res) {
    let pageSize = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let sortBy = req.query.sort ? req.query.sort : "dateCreated";
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
                ref : {[Op.substring]: search},
                choice: { [Op.substring]: search }
            },
        }
        : undefined;
    const total = await Modelticket.count({ where: conditions });
    const pageTotal = Math.ceil(total / pageSize);

    const pageContents = await Modelticket.findAll({
        offset: offset,
        limit: pageSize,
        order: [[sortBy, sortOrder.toUpperCase()]],
        where: conditions,
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
        const target_user = await Modelticket.findOne({
            where: {
                uuid: tid
            }
        });
        if (target_user == null) {
            throw new HttpError(410, "User doesn't exists");
        }
        console.log(target_user);
        return res.render("user/view", {
            target: target_user
        });
    }
    catch (error) {
        console.error(`Invalid request: ${tid}`);
        error.code = (error.code == undefined) ? 500 : error.code;
        console.log(error);
        return next(error);
    }
});
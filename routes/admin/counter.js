import { Router } from 'express';
import { Modelroomtype } from '../../data/roomtype.mjs';
import { HttpError } from '../../utils/errors.mjs';
import { ModelUser } from '../../data/user.mjs';
import ORM from "sequelize";
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
router.get("/users", users);
router.get("/users-data", users_data);
router.get("/room", room);
router.get("/room-data", room_data);
 async function users (req, res) {
    const users = await ModelUser.count({
        raw: true
    });
    const customer = await ModelUser.findAndCountAll({
        where: {
            role: "customer"
        }
    });
    const staff = await ModelUser.findAndCountAll({
        where: {
            role: "staff"
        }
    });
    const manager = await ModelUser.findAndCountAll({
        where: {
            role: "manager"
        }
    });
    return res.render("admin/Counter", {
        total: users,
        customer: customer.count,
        staff: staff.count,
        manager: manager.count
    })
}
async function users_data(req, res) {
    let pageSize = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let sortBy = req.query.sort ? req.query.sort : "name";
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
                role: { [Op.substring]: search },
                name: { [Op.substring]: search },
                email: { [Op.substring]: search },
                verified: { [Op.substring]: search },
            },
        }
        : undefined;
    const total = await ModelUser.count({
        raw :true
    });
    const pageTotal = Math.ceil(total / pageSize);

    const pageContents = await ModelUser.findAll({
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

async function room(req, res) {
    const total  = await Modelroomtype.count({
        raw: true
    });
    const unbooked = await Modelroomtype.count({
        where: {
            "booked": "No"
        }
    });
    const booked = await Modelroomtype.count({
        where: {
            booked: "Yes"
        }
    });
    return res.render("admin/roomcounter", {
        total: total,
        unbooked: unbooked,
        booked: booked
    })
}
async function room_data(req, res) {
    let pageSize = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let sortBy = req.query.sort ? req.query.sort : "location";
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
                date: req.body.date[i],
                time: req.body.time[i],
                location: req.body.location[i].toUpperCase(),
                price: req.body.price[i],
                roomtype: req.body.roomtype[i],
                admin_uuid: req.user.uuid
            },
        }
        : undefined;
    const total = await Modelroomtype.count({
        raw: true
    });
    const pageTotal = Math.ceil(total / pageSize);

    const pageContents = await Modelroomtype.findAll({
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

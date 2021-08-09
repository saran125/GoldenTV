import { Router } from 'express';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { HttpError } from '../../utils/errors.mjs';
import { ModelUser } from '../../data/user.mjs';
import {ModelFaq} from '../../data/faq.mjs';
import {ModelReview} from '../../data/review.mjs';
// import {ModelRoomReview} from '../data/roomreview.mjs';

import ORM from "sequelize";
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
//Edit options
router.get("/option", option_page);
router.post("/option", option_process);
//View options
router.get("/viewoption", viewoption);
router.get("/option-data", option_data);

router.get("/retrievereview-data", review_data);
router.get("/retrievefaq-data", retrieve_data);

function option_page(req, res) {
    console.log("Option page accessed");
    return res.render('admin/option');
}
//  update choice page 
async function option_process(req, res) {
    // console.log('Description created: $(booking.choice)');
    try {
        console.log(req.body);
        for (let i = 0; i < req.body.location.length; i++) {
            const option = await ModelRoomInfo.create({
                // date: req.body.date[i],
                // time: req.body.time[i],
                // location: req.body.location[i].toUpperCase(),
                // price: req.body.price[i],
                // roomtype: req.body.roomtype[i],
                // admin_uuid: req.user.uuid
                roomname: req.body.roomname[i],
                roomsize: req.body.roomsize[i],
                roomprice: req.body.roomprice[i],
                roominfo: req.body.roominfo[i],
                roomimage: req.file.filename[i],
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

async function viewoption(req, res) {
    console.log("Looking at all the options ");
    // const option = await Modelroomtype.findAll({raw:true});
    return res.render('admin/viewoption');

}

/**
 * Provides bootstrap table with data
 * @param {import('express')Request}  req Express Request handle
 * @param {import('express')Response} res Express Response handle
 */
async function option_data(req, res) {
    try {
        console.log('finding data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "time";
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
                    roomtype: { [Op.substring]: search },
                    price: { [Op.substring]: search },

                    // location: { [Op.substring]: search },
                    // time: { [Op.substring]: search },
                    // date: { [Op.substring]: search },
                    // roomtype: { [Op.substring]: search },
                    // price: { [Op.substring]: search },
                },
            }
            : undefined;
        const total = await Modelroomtype.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);

        const pageContents = await Modelroomtype.findAll({
            offset: offset,
            limit: pageSize,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: conditions,
            raw: true // Data only, model excluded
        });
        return res.json({
            total: total,
            rows: pageContents,
        });
    } catch (error) {
        console.error("Failed to retrieve all Options");
        console.error(error);
        return res.status(500).end();
    }
}
router.post("/delete_option/:uuid", async function (req, res) {
    console.log("contents deleted")
    console.log(req.body);
    Modelroomtype.findOne({
        where: {
            uuid: req.params.uuid
        },
    }).then((option) => {
        if (option != null) {
            Modelroomtype.destroy({
                where: {
                    uuid: req.params.uuid
                }

            })
            return res.redirect("/admin/viewoption");
        }
        
    });
});
router.get("/update_option/:uuid", async function (req, res) {
    console.log("update Option page accessed");
    const option = await Modelroomtype.findOne({
        where: {
            roomtype_id: req.params.uuid
        }
    });
    return res.render('admin/update_option', {
        option
    });
});
router.post("/update_option/:uuid", async function (req, res) {
    console.log("updated Option page accessed");
    const option = await Modelroomtype.update({
        location: req.body.location,
        date:req.body.date,
        time: req.body.time,
        small: req.body.small,
        medium: req.body.medium,
        large: req.body.large,
        admin_uuid: req.user.uuid
    }, {
        where: {
            roomtype_id: req.params.uuid
        }
    });
    console.log("Updated Option")
    return res.redirect('/admin/viewoption',);
});

async function retrieve_data(req, res) {
    try {
        console.log('retriving data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
        let sortOrder = req.query.order ? req.query.order : "desc";
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
                    questions: { [Op.substring]: search },
                    answers: { [Op.substring]: search },
                    
                },
            }
            : undefined;
        const total = await ModelFaq.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);

        const pageContents = await ModelFaq.findAll({
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
    } catch (error) {
        console.error("Failed to retrieve all Options");
        console.error(error);
        // internal server error
        return res.status(500).end();
    }
}

async function review_data(req, res) {
    try {
        console.log('retriving data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
        let sortOrder = req.query.order ? req.query.order : "desc";
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
                    rating: { [Op.substring]: search },
                    feedback: { [Op.substring]: search },
                    
                },
            }
            : undefined;
        const total = await ModelReview.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);

        const pageContents = await ModelReview.findAll({
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
    } catch (error) {
        console.error("Failed to retrieve all Options");
        console.error(error);
        // internal server error
        return res.status(500).end();
    }
}
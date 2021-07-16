import { Router } from 'express';

import { Modeloption } from '../../data/option.mjs';
import { HttpError } from '../../utils/errors.mjs';
import ORM from "sequelize";
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
router.post("/option", option_process);
router.get("/option", option_page);
router.get("/viewoption", viewoption);
//  update choice page 
async function option_process(req, res) {
    // console.log('Description created: $(booking.choice)');
    try {
        console.log(req.body);

        for (let i = 0; i < req.body.location.length; i++) {
            const option = await Modeloption.create({
                time: req.body.time[i],
                location: req.body.location[i],
                small: req.body.small[i],
                medium: req.body.medium[i],
                large: req.body.large[i]
            });
            console.log(option);
        }
        return res.redirect("/admin/viewoption");

    }
    catch (error) {
        console.error(error);
    }
}

function option_page(req, res) {
    console.log("Option page accessed");
    return res.render('admin/option');
}
async function viewoption(req, res) {
    console.log("Looking at all the options ");
    // const option = await Modeloption.findAll({raw:true});
    return res.render('admin/viewoption');

}
router.get("/option-data", option_data);
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
                    location: { [Op.substring]: search },
                    time: { [Op.substring]: search },
                },
            }
            : undefined;
        const total = await Modeloption.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);

        const pageContents = await Modeloption.findAll({
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
        return res.status(500).end();
    }
}
router.post("/delete_option/:uuid", async function (req, res) {
    console.log("contents deleted")
    console.log(req.body);
    Modeloption.findOne({
        where: {
            uuid: req.params.uuid
        },
    }).then((option) => {
        if (option != null) {
            Modeloption.destroy({
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
    const option = await Modeloption.findOne({
        where: {
            uuid: req.params.uuid
        }
    });
    return res.render('admin/update_option', {
        option
    });
});
router.post("/update_option/:uuid", async function (req, res) {
    console.log("updated Option page accessed");
    const option = await Modeloption.update({
        location: req.body.location,
        time: req.body.time,
        small: req.body.small,
        medium: req.body.medium,
        large: req.body.large
    }, {
        where: {
            uuid: req.params.uuid
        }
    });
    console.log("Updated Option")
    return res.redirect('/admin/viewoption',);
});
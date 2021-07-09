import { Router } from 'express';
import { Modelchoice } from '../../data/update_choice.mjs';
import { Modeloption } from '../../data/option.mjs';
import { HttpError } from '../../utils/errors.mjs';
const router = Router();
export default router;
router.post("/update_choice", update_choice_process);
router.get("/update_choice", update_choice_page);
router.post("/option", option_process);
router.get("/option", option_page);
router.get("/viewoption", viewoption);
//  update choice page 
async function update_choice_process(req, res) {
    try {
        const [user, created] = await Modelchoice.findOrCreate({
            where: { uuid: "00000000-0000-0000-0000-000000000011" },
            defaults: {
                time1: req.body.time1,
                time2: req.body.time2,
                time3: req.body.time3,
                time4: req.body.time4,
                time5: req.body.time5,
                location1: req.body.location1,
                location2: req.body.location2,
                location3: req.body.location3,
                location4: req.body.location4,
                location5: req.body.location5,
                date1: req.body.date1,
                date2: req.body.date2,
                date3: req.body.date3,
                date4: req.body.date4,
                date5: req.body.date5
            }
        });
        console.log(user.uuid); // 'sdepold'
        console.log(user.time1); // This may or may not be 'Technical Lead JavaScript'
        console.log(created); // The boolean indicating whether this instance was just created
        if (created == false) {
            console.log(req.body); // This will certainly be 'Technical Lead JavaScript'
            const choice = await Modelchoice.findOne({
                where: {
                    "uuid": "00000000-0000-0000-0000-000000000011"
                }
            });
            choice.update({
                time1: req.body.time1,
                time2: req.body.time2,
                time3: req.body.time3,
                time4: req.body.time4,
                time5: req.body.time5,
                location1: req.body.location1,
                location2: req.body.location2,
                location3: req.body.location3,
                location4: req.body.location4,
                location5: req.body.location5,
                date1: req.body.date1,
                date2: req.body.date2,
                date3: req.body.date3,
                date4: req.body.date4,
                date5: req.body.date5
            });
            choice.save();
        }
        return res.redirect("/home");
    }
    catch (error) {
        console.error(error);
    }
}
async function update_choice_page(req, res) {
    console.log("update choice page accessed");
    const choice = await Modelchoice.findOne({
        where: {
            uuid: "00000000-0000-0000-0000-000000000011"
        }
    });
    return res.render('admin/choice', {
        choice
    });
}
async function option_process(req, res) {
    // console.log('Description created: $(booking.choice)');
    try {
        console.log(req.body);
        const option = await Modeloption.create({
            time: req.body.time,
            location: req.body.location,
            date: req.body.date});
        console.log(option);
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
                    date: { [Op.substring]: search },
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
        date: req.body.date
    }, {
        where: {
            uuid: req.params.uuid
        }
    });
    console.log("Updated Option")
    return res.redirect('/admin/viewoption',);
});
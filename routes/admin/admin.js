import { Router } from 'express';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { HttpError } from '../../utils/errors.mjs';
import { ModelUser } from '../../data/user.mjs';
import { ModelFaq } from '../../data/faq.mjs';
import { ModelReview } from '../../data/review.mjs';
import { Modelpromo} from '../../data/promo.mjs';
import { upload } from '../../utils/multer.mjs';
import fs from 'fs';
// import {ModelRoomReview} from '../data/roomreview.mjs';
import {Modelticket} from '../../data/tickets.mjs';
import ORM from "sequelize";
import { runInContext } from 'vm';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

//Create options
router.get("/option", option_page);
router.post("/option",
    upload.any(),
    option_process);

router.get("/updateoption/:room_uuid", updateoption_page);
router.post("/updateoption/:room_uuid",
    upload.any(),
    updateoption_process);
router.get("/deleteoption/:room_uuid", deleteoption);

//View options
router.get("/viewoption", viewoption);
router.get("/option-data", option_data);
router.get("/retrievereview-data", review_data);
router.get("/retrievefaq-data", retrieve_data);
router.get("/ticket-data", ticket_data);
router.post("/user-data", user_data);
router.get("/promo", promo);
router.get("/create/promo", add_promo);
router.post("/create/promo", promo_process);
router.get("/promo-data", promo_data);
router.get("/delete_promo/:promo_id", deletepromo);
router.get("/update_promo/:promo_id", update_promo);
router.post("/update_promo/:promo_id", update_promo_process);
/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
function option_page(req, res, next) {
    console.log("Option page accessed");
    return res.render('admin/option');
}

//  update choice page 
/**
 * Renders the login page
 * @param {Request}  req Express Request handle
 * @param {Response} res Express Response handle
 */
async function option_process(req, res) {
    try {
        var fileKeys = req.files;
        let uploadedFiles = [];
        for (let item of fileKeys) {
            uploadedFiles.push(item.filename);
        }

        for (let i = 0; i < req.body.roomname.length; i++) {
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
                    roomname: { [Op.substring]: search },
                    roomsize: { [Op.substring]: search },
                    roomprice: { [Op.substring]: search },
                    roominfo: { [Op.substring]: search },
                    roomimage: { [Op.substring]: search },
                    location: { [Op.substring]: search },
                    "admin_id": { [Op.substring]: req.user.uuid }

                    // location: { [Op.substring]: search },
                    // time: { [Op.substring]: search },
                    // date: { [Op.substring]: search },
                    // roomtype: { [Op.substring]: search },
                    // price: { [Op.substring]: search },
                },
            }
            : undefined;
        const total = await ModelRoomInfo.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);

        const pageContents = await ModelRoomInfo.findAll({
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

/**
 * Deletes a specific user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
async function deleteoption(req, res, next) {
    try {
        const tid = String(req.params.room_uuid);
        // if (tid == undefined)
        // 	throw new HttpError(400, "Target not specified");
        const target = await ModelRoomInfo.findByPk(tid);
        // movieimage = target.movieimage
        // if (target == null)
        // 	throw new HttpError(410, "User doesn't exists");
        target.destroy();
        console.log(`Deleted movie: ${tid}`);
        return res.redirect("/admin/viewoption");
    }
    catch (error) {
        console.error(`Failed to delete`)
        error.code = (error.code) ? error.code : 500;
        return next(error);
    }
};

    // console.log("contents deleted")
    // console.log(req.body);
    // ModelRoomInfo.findOne({
    //     where: {
    //         room_uuid: req.params.room_uuid
    //     },
    // }).then((option) => {
    //     if (option != null) {
    //         ModelRoomInfo.destroy({
    //             where: {
    //                 room_uuid: req.params.room_uuid
    //             }

    //         })
    //         return res.redirect("/admin/viewoption");
    //     }
    // });


async function updateoption_page(req, res) {
    const tid = String(req.params.room_uuid);
    const room = await ModelRoomInfo.findByPk(tid);
    console.log("update Option page accessed");
    // const option = await ModelRoomInfo.findOne({
    //     where: {
    //         roomtype_id: req.params.uuid
    //     }
    // });
    return res.render('admin/update_option', { room: room });
};

async function updateoption_process(req, res) {
    console.log("updated Option page accessed");
    try {
        let update_image = {};
        const tid = String(req.params.room_uuid);
        const room = await ModelRoomInfo.findByPk(tid);
        const roomimage = './public/uploads/' + room['roomimage'];

        if (req.file != null && typeof req.file == 'object') {
            if (Object.keys(req.file).length != 0) { //select file
                fs.unlink(roomimage, function (err) {
                    if (err) {
                        throw err
                    } else {
                        console.log("Successfully deleted the file.")
                    }
                })
                update_image.image = req.file.filename;
            }
            else {
                update_image.image = room.roomimage; //select NO file
            }
        }
        room.update({
            roomname: req.body.roomname,
            roomsize: req.body.roomsize,
            roomprice: req.body.roomprice,
            roominfo: req.body.roominfo,
            roomimage: update_image.image,
            location: req.body.location.toUpperCase()
        });
        room.save();
        return res.redirect('/admin/viewoption');
    }
    catch (error) {
        console.error(`Failed to update user ${req.body.room_uuid}`);
        // console.error(error);
        // const movieimage = './public/uploads/' + movie['movieimage'];
        // fs.unlink(movieimage, function(err) {
        // 	if (err) {
        // 	  throw err
        // 	} else {
        // 	  console.log("Successfully deleted the file.")
        // 	}
        //   })
        // const movie  = await ModelMovieInfo.findByPk(tid);
        // const movie = await ModelMovieInfo.findByPk(tid);
        return res.render('admin/update_option');
    }
}

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
};
async function ticket_data(req, res) {
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
                    room_id: { [Op.substring]: search },
                    time: { [Op.substring]: search },
                    date: { [Op.substring]: search },
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
    } catch (error) {
        console.error("Failed to retrieve all Options");
        console.error(error);
        // internal server error
        return res.status(500).end();
    }
}
async function user_data(req, res) {
    console.log("Loooking for the user data");
    console.log(req.body);
    const user = await ModelUser.findByPk(req.body.user_id);
    console.log(user);
        return res.json({
            email:user.email,
            name:user.name
        })

};
function promo(req, res) {
    console.log("promo code page accessed");
    return res.render('admin/promo_code');
};

async function promo_data(req, res) {
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
                    discount: { [Op.substring]: search },
                    promo_code: { [Op.substring]: search },
                    roomsize: { [Op.substring]: search },
                },
            }
            : undefined;
        const total = await Modelpromo.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);

        const pageContents = await Modelpromo.findAll({
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
async function deletepromo(req, res, next) {
    try {
        const tid = String(req.params.promo_id);
        const target = await Modelpromo.findByPk(tid);
        target.destroy();
        console.log(`Deleted promo code: ${tid}`);
        return res.redirect("/admin/promo");
    }
    catch (error) {
        console.error(`Failed to delete`)
        error.code = (error.code) ? error.code : 500;
        return next(error);
    }
};
function add_promo(req, res){
    console.log('addin promo code');
    return res.render('admin/add_promo');
}

async function promo_process(req, res){
    console.log('adding promo code to database');
    console.log(req.body);
    let array = Array.isArray(req.body.code);
    if(array == false){
        const promo = await Modelpromo.create({
            promo_code:req.body.code,
            roomsize: req.body.roomsize,
            discount: req.body.discount
        });
    }
    if (array == true){
        for(let i = 0; i< req.body.code.length;i++){
            const promo = await Modelpromo.create({
                promo_code: req.body.code[i],
                roomsize: req.body.roomsize[i],
                discount: req.body.discount[i]
            })
        }
    }
    console.log(array);
    return res.redirect('/admin/promo');
}
async function update_promo(req, res) {
    const tid = String(req.params.promo_id);
    const promo = await Modelpromo.findByPk(tid);
    console.log("update Promo Code page accessed");
    return res.render('admin/update_promo', {promo});
};

async function update_promo_process(req, res) {
    console.log("updated Option page accessed");
    try {
        const tid = String(req.params.promo_id);
        const promo = await Modelpromo.findByPk(tid);
        promo.update({
            discount: req.body.discount,
            roomsize:req.body.roomsize,
            promo_code:req.body.code
        });
        promo.save();
        return res.redirect('/admin/promo');
    }
    catch (error) {
        console.error(`Failed to update user ${req.body.room_uuid}`);
        return res.render('admin/update_promo');
    }
}

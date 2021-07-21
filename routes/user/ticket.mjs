import { Router } from 'express';
import { nanoid } from 'nanoid'
import { Modelticket } from '../../data/ticket.mjs';
import { Modeloption } from '../../data/option.mjs';
const router = Router();
export default router;
router.get("/ticketlist/tickettable", tickettable);
router.get("/ticketlist/tickettable-data", tickettable_data);
async function tickettable(req, res) {
    return res.render('user/tickets');
}
async function tickettable_data(req, res) {
    const ticket = await Modelticket.findAll({ raw: true });
    return res.json({
        "total": ticket.length,
        "rows": ticket
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
router.get("/booked_successfully", async function (req, res) {
    console.log("after booking page accessed");
    const roomtype = await ModelRoomtype.findOne({
        where: {
            time: room_details.time, location: room_details.location, date: room_details.date
        }
    });
    console.log(room_details.roomtype);
    if (room_details.roomtype == 'Small') {
        console.log('Small - 1');
        roomtype.update({
            small: roomtype.small - 1
        });
        roomtype.save();
    }
    else if (room_details.roomtype == 'Medium') {
        console.log('Medium - 1');
        roomtype.update({
            medium: roomtype.medium - 1
        });
        roomtype.save();
    }
    else if (room_details.roomtype == 'Big') {
        console.log('Big - 1');
        roomtype.update({
            big: roomtype.big - 1
        });
        roomtype.save();
    }
    const ticket = await Modelticket.create({
        choice: room_details.choice,
        location: room_details.location,
        date: room_details.date,
        time: room_details.time,
        roomtype: room_details.roomtype,
        ref: random_ref,
    });
    console.log(room_details);
    return res.render('user/after_booking', {
        room_details, ticket
    });
});
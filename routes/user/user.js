import { Router } from 'express';
import { nanoid } from 'nanoid'
import { ModelRoomtype } from '../../data/roomtype.mjs';
import { Modelticket } from '../../data/ticket.mjs';
import { ModelCheckout } from '../../data/checkout.mjs';
import { Modelchoice } from '../../data/update_choice.mjs';
import { Modeloption } from '../../data/option.mjs';
const router = Router();
export default router;
router.post("/booking", booking_process);
router.get("/booking", booking_page);
router.post("/roomtype", roomtype_process);
router.get("/roomtype", roomtype_page);
router.post("/checkout", checkout_process);
router.get("/checkout", checkout_page);
// booking page
var random_ref = nanoid(8);
export var room_details = { location: '', date: '', time: '', choice: '', uuid: '', roomtype: '', ref: random_ref };
async function booking_process(req, res) {
    console.log('Description created: $(booking.choice)');
    try {
        console.log(req.body.time);
        const roomtype = await ModelRoomtype.findOne({ where: { time: req.body.time, location: req.body.location, date: req.body.date } });
        console.log(roomtype);
        if (roomtype === null) {
            console.log('Not found!');
            const room = await ModelRoomtype.create({
                time: req.body.time,
                location: req.body.location,
                date: req.body.date,
                small: 5,
                medium: 5,
                big: 5
            });
            console.log(room);
        }

        else {
            console.log(roomtype.uuid);
        }
        room_details.location = req.body.location;
        room_details.date = req.body.date;
        room_details.time = req.body.time;
        room_details.choice = req.body.choice;
        room_details.uuid = roomtype.uuid
        return res.redirect("/user/roomtype");

    }
    catch (error) {
        console.error(error);
    }
}

async function booking_page(req, res) {
    console.log("booking page accessed");
    const option = await Modeloption.findAll({
        raw: true
    });
    return res.render('user/booking', {
        option
    });

}
async function roomtype_process(req, res) {
    console.log(req.body.roomtype);
    room_details.roomtype = req.body.roomtype;
    return res.redirect("/paymentOption");
}
async function roomtype_page(req, res) {
    console.log("Choosing roomtype page accessed");
    console.log(room_details);
    var room_left = [];
    const roomtype = await ModelRoomtype.findOne({
        where: {
            time: room_details.time, location: room_details.location, date: room_details.date
        }
    });
    if (roomtype.small != 0) {
        room_left.push('Small')
    };
    if (roomtype.medium != 0) {
        room_left.push('Medium')
    };
    if (roomtype.big != 0) {
        room_left.push('Big')
    };
    if (room_left.length == 0) {
        console.log("There is no room left")
        return res.render('user/noroom')
    };
    return res.render('user/roomtype', {
        room_details, roomtype, room_left
    });
}
// ---------------------------------------
// checkout page
async function checkout_process(req, res) {
    try {
        const [user, created] = await ModelCheckout.findOrCreate({
            where: { username: "nigel_123" },
            defaults: {
                username: "nigel_123",
                card_number: req.body.card_number,
                card_holder: req.body.card_holder,
                expiry_month: req.body.expiry_month,
                expiry_year: req.body.expiry_year,
                ccv: req.body.cvv,
            }
        });
        console.log(user.uuid); // 'sdepold'
        console.log(user.card_number); // This may or may not be 'Technical Lead JavaScript'
        console.log(created); // The boolean indicating whether this instance was just created
        if (created == false) {
            console.log(req.body); // This will certainly be 'Technical Lead JavaScript'
        }
        return res.redirect('/user/booked_successfully');
    }
    catch (error) {
        console.error(error);
    }
}

async function checkout_page(req, res) {
    console.log("checkout page accessed");
    const card_details = await ModelCheckout.findOne({
        where: {
            username: "nigel_123"
        }
    });
    return res.render('user/checkout', {
        card_details
    });
}


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
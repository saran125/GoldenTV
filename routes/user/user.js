import { Router } from 'express';
import { nanoid } from 'nanoid';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { Modelticket } from '../../data/ticket.mjs';
import { Modeloption } from '../../data/option.mjs';
const router = Router();
export default router;
router.post("/booking/:choice", booking_process);
router.get("/booking/:choice", booking_page);
// booking page
var random_ref = nanoid(8);
export var room_details = { location: '', date: '', time: '', choice: '', uuid: '', roomtype: '', ref: random_ref, price: 0  };
async function booking_process(req, res) {
    console.log('Description created: $(booking.choice)');
    try {
        room_details = { location: '', date: '', time: '', choice: '', uuid: '', roomtype: '', ref: random_ref, price: 0 };
        console.log(req.body);
        Modeloption.destroy({
            where: {
                small: 0, medium: 0, large: 0
            }
        });
        const roomtype = await Modeloption.findOne({ where: { time: req.body.time, location:req.body.location, date:req.body.date } });
        console.log(roomtype);
        console.log(roomtype.uuid);
        room_details.location = req.body.location;
        room_details.time = req.body.time;
        room_details.roomtype = req.body.room;
        room_details.date = req.body.date;
        room_details.uuid = roomtype.uuid;
        room_details.choice = req.params.choice;
        const room = await ModelRoomInfo.findOne({
            where: {
                "roominfo_uuid": "test"
            }
        });
        if(req.body.room == 'small'){
            room_details.price += room.small_roomprice
        }
        if (req.body.room == 'medium') {
            room_details.price += room.med_roomprice
        }
        if (req.body.room == 'large') {
            room_details.price += room.large_roomprice
        }
        return res.redirect("/payment/generate");
    }
    catch (error) {
        console.error(error);
    }
}
async function booking_page(req, res) {
    console.log("booking page accessed");
    room_details = { };
    var choice = req.params.choice;
    console.log(choice);
    Modeloption.sync({ alert: true }).then(() => {
        return Modeloption.findAll({ attributes: ['location'] });
    }).then((data) => {
        let All_location = [];
        data.forEach(element => {
            
            All_location.push(element.toJSON().location);
            console.log(element.toJSON().location);
        })
        console.log(All_location);
        var location = [];
        for (let i = 0; i < All_location.length; i++) {
            if (location.indexOf(All_location[i]) === -1) {
                location.push(All_location[i]);
            }
        }
        console.log(location);
        return res.render('user/booking', {
            location, Modeloption, choice
        });
    })
        .catch((err) => {
            console.log(err)
        });    
}

router.post("/date", async function (req, res) {
    console.log("Loooking for all the date");
    console.log(req.body);
    Modeloption.sync({ alert: true }).then(() => {
        return Modeloption.findAll({ attributes: ['date'], where: { location: req.body.location } });
    }).then((data) => {
        let date = [];
        data.forEach(element => {
            date.push(element.toJSON().date);
            console.log(element.toJSON().date);
        })
        console.log(date);
        var mydate = [];
        for (let i = 0; i < date.length; i++) {
            if (mydate.indexOf(date[i]) === -1) {
                mydate.push(date[i]);
            }
        }
        console.log(mydate);
        return res.json({
            date: mydate
        })
    })
});
router.post("/time", async function (req, res){
    console.log("Loooking for all the time");
    console.log(req.body);
    Modeloption.sync({ alert: true }).then(() => {
        return Modeloption.findAll({ attributes: ['time'], where: { location: req.body.location, date: req.body.date } });
    }).then((data) => {
        let time = [];
        data.forEach(element => {
            time.push(element.toJSON().time);
            console.log(element.toJSON().time);
        })
        console.log(time);
        return res.json({
            time: time
        })
    })
});
router.post("/roomtype", async function (req, res) {
    console.log("Loooking for all the roomtype");
    console.log(req.body);
    const roomtype = await Modeloption.findOne({
        where: {
            time: req.body.time, date: req.body.date, location: req.body.location
        }
    });
    if (roomtype.small <= 0) {
        var small = false;
    };
    if (roomtype.medium <= 0) {
       var medium = false;
    };
    if (roomtype.large <= 0) {
       var large = false;
    };
    return res.json({
        room: [small, medium, large]
    })
});
// ---------------------------------------

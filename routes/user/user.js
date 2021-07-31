import { Router } from 'express';
import { nanoid } from 'nanoid';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { Modelroomtype } from '../../data/roomtype.mjs';
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
        room_details = { location: '', date: '', time: '', choice: '', uuid: '', ref: random_ref, price: 0 };
        console.log(req.body);
        const roomtype = await Modelroomtype.findOne({ where: { time: req.body.time, location: req.body.location, date: req.body.date, roomtype: req.body.room, booked: 'No'  } });
        roomtype.update({
            choice: req.params.choice
        });
        roomtype.save();
        console.log(roomtype);
        return res.redirect("/payment/generate/"+ roomtype.roomtype_id);
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
    Modelroomtype.sync({ alert: true }).then(() => {
        return Modelroomtype.findAll({ attributes: ['location'], where: { booked: 'No'} });
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
            location, Modelroomtype, choice
        });
    })
        .catch((err) => {
            console.log(err)
        });    
}

router.post("/date", async function (req, res) {
    console.log("Loooking for all the date");
    console.log(req.body);
    Modelroomtype.sync({ alert: true }).then(() => {
        return Modelroomtype.findAll({ attributes: ['date'], where: { location: req.body.location, booked: 'No'  } });
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
    Modelroomtype.sync({ alert: true }).then(() => {
        return Modelroomtype.findAll({ attributes: ['time'], where: { booked: 'No' , location: req.body.location, date: req.body.date } });
    }).then((data) => {
        let time = [];
        data.forEach(element => {
            time.push(element.toJSON().time);
            console.log(element.toJSON().time);
        })
        console.log(time);
        var mytime = [];
        for (let i = 0; i < time.length; i++) {
            if (mytime.indexOf(time[i]) === -1) {
                mytime.push(time[i]);
            }
        }
        console.log(mytime);
        return res.json({
            time: mytime
        })
    })
});
router.post("/roomtype", async function (req, res) {
    console.log("Loooking for all the roomtype");
    console.log(req.body);
    const Small = await Modelroomtype.findAndCountAll({
        where: {
            time: req.body.time, date: req.body.date, location: req.body.location, roomtype: "Small", booked: 'No'
        }
    });
    const check = await Modelroomtype.findOne({
        where: {
            time: req.body.time, date: req.body.date, location: req.body.location, roomtype: "Small", booked: 'No'
        }
    });
    const Medium = await Modelroomtype.findAndCountAll({
        where: {
            time: req.body.time, date: req.body.date, location: req.body.location, roomtype: "Medium", booked: 'No'
        }
    });
    const Large = await Modelroomtype.findAndCountAll({
        where: {
            time: req.body.time, date: req.body.date, location: req.body.location, roomtype: "Large", booked: 'No'
        }
    });
    console.log("Small " + Small.count);
    console.log(check);
    console.log("Medium " + Medium.count);
    console.log( "Large "+ Large.count);
    if (Small.count <= 0) {
        var small = false;
    };
    if (Medium.count <= 0) {
       var medium = false;
    };
    if (Large.count <= 0) {
       var large = false;
    };
    return res.json({
        room: [small, medium, large]
    })
});
// ---------------------------------------

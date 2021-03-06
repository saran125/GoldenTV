import { Router } from 'express';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { Modelticket } from '../../data/tickets.mjs';
import {ModelReview} from '../../data/review.mjs';
import{Modelpromo} from '../../data/promo.mjs';
const router = Router();
import ORM from "sequelize";
const { Sequelize, DataTypes, Model, Op } = ORM;
export default router;
router.post("/booking/:choice/:id", booking_process);
router.get("/booking/:choice/:id", booking_page);
router.get("/retrievecustomerreview-data", creview_data);
// booking page
async function booking_process(req, res) {
    try {
        console.log(req.body);
        const time = req.body.time;
        const date = req.body.date;
        let promo = req.body.promo;
        console.log(promo);
        if(promo == ''){
            console.log('Promo is null');
            promo +='No_promo';
        }
        return res.redirect("/payment/generate/" + req.params.choice + "/" + req.params.id + "/" + date + "/" +time+'/'+promo);
    }
    catch (error) {
        console.error(error);
    }
}
async function booking_page(req, res) {
    try {
        let user = req.user.uuid;
        console.log(user);
        if (req.user.role == 'customer') {
    console.log("booking page accessed");
    console.log(req.params.id);
    const room = await ModelRoomInfo.findOne({where:{
        room_uuid: req.params.id
    }});
    const small = await Modelpromo.findOne({
        where: {
            roomsize: 'Small'
        }
    });
    const medium = await Modelpromo.findOne({
        where: {
            roomsize: 'Medium'
        }
    });
    const large = await Modelpromo.findOne({
        where: {
            roomsize: 'Large'
        }
    });
    var s = true;
    var m = true;
    var l = true;
    if(small === null){
        s = false
        console.log('small promo not found!')
    }
    if (large === null) {
        l = false
        console.log('large promo not found!')
    }
    if (medium === null) {
        m = false
        console.log('medium promo not found!')
    }
    console.log(room);
        return res.render('user/booking', {
             choice:req.params.choice, room, small, medium, large,s,m,l
        });    
        }
        else { return res.render('404'); }
    }
    catch (error) {
        return res.render('404');
    };
};

router.post("/date", async function (req, res){
    console.log("Loooking for all the time");
    console.log(req.body);
    const date = await Modelticket.findOne({ where: {time: req.body.timeslot, room_id:req.body.room_id } });
    console.log(date);
    if (date === null) {
        // sample 
        var today = ['2021-2-12'];
        console.log(today);
        console.log('Not found!');
        return res.json({
            block: today
        })
    } 
    else {
        Modelticket.sync({ alert: true }).then(() => {
            return Modelticket.findAll({ attributes: ['date'], where: { time: req.body.timeslot, room_id: req.body.room_id } });
        }).then((data) => {
            let date = [];
            data.forEach(element => {
                date.push(element.toJSON().date);
                console.log(element.toJSON().date);
            })
            console.log(date);
            var block_date = [];
            for (let i = 0; i < date.length; i++) {
                if (block_date.indexOf(date[i]) === -1) {
                    block_date.push(date[i]);
                }
            }
            let date_block = []
            for(let i = 0; i <block_date.length; i++){
                if(block_date[i].split('')[5] == '0'){
                let str = block_date[i].split('');
                str[5] = '';
                str = str.join('');
                date_block.push(str);
                console.log(str);
                }
                else{
                    date_block.push(block_date[i]);
                }
            }
            console.log(date_block);
            return res.json({
                block: date_block
            })
        })
    }
  
});
async function creview_data(req, res) {
    try {
        console.log('retriving data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "rating";
        let sortOrder = req.query.order ? req.query.order : "asc";
        let search = req.query.search;
        if (pageSize < 0) {
            throw new HttpError(400, "Invalid page size");
        }
        if (offset < 0) {
            throw new HttpError(400, "Invalid offset index");
        }
        /** @type {import('sequelize/types').WhereOptions} */
        const conditions = search? {
                [Op.or]: {
                    rating: { [Op.substring]: search },
                    feedback: { [Op.substring]: search },
                type_id: { [Op.substring]: search },
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

// ---------------------------------------

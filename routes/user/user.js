import { Router } from 'express';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { Modelticket } from '../../data/tickets.mjs';
const router = Router();
export default router;
router.post("/booking/:choice/:id", booking_process);
router.get("/booking/:choice/:id", booking_page);
// booking page
async function booking_process(req, res) {
    try {
        console.log(req.body);
        const time = req.body.time;
        const date = req.body.date;
        return res.redirect("/payment/generate/" + req.params.choice + "/" + req.params.id + "/" + date + "/" +time);
    }
    catch (error) {
        console.error(error);
    }
}
async function booking_page(req, res) {
    console.log("booking page accessed");
    console.log(req.params.id);
    const room = await ModelRoomInfo.findOne({where:{
        room_uuid: req.params.id
    }});
    console.log(room);
        return res.render('user/booking', {
             choice:req.params.choice, room
        });    
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

// ---------------------------------------

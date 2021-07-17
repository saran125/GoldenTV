

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
import { Router }       from 'express';
import {ModelRoomReview} from '../data/roomreview.mjs';
import { flashMessage } from '../utils/flashmsg.mjs'
const router = Router();
export default router;

router.post("/roomreview", async function (req, res) {
	const roomlist = await ModelRoomReview.create({
		"rating"  			: req.body.Rating,
		"feedback"		: req.body.feedback,
	});
	console.log("room review contents received");
	console.log(roomlist);
	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	if (errors.length > 0) {
		flashMessage(res, 'error', 'Invalid review!', 'fas fa-sign-in-alt', true);
		return res.redirect(req.originalUrl);
	}
	else {
		flashMessage(res, 'success', 'Successfully created a review!', 'fas fa-sign-in-alt', true);
		return res.redirect("/retrieveroomreview");
	}

});

router.get("/roomreview", async function create(req, res) {
	// res.sendFile("dynamic/uploads/{{ }}");
	const homedes = await ModelRoomReview.findOne({
		where: {
			"feedback": "great"
		}
	});
	console.log("Home page accessed");
	return res.render('createroomreview', {
		homedescription: homedes.homedescription,
	                   
		questions: "Ending in 2 days!",
		answers: "Coming Soon!",
	
	});

});

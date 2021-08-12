import { Router }       from 'express';
import {ModelSongReview} from '../data/songreview.mjs';
import { flashMessage } from '../utils/flashmsg.mjs'
const router = Router();
export default router;

router.post("/songreview", async function (req, res) {
	const roomlist = await ModelSongReview.create({
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
		return res.redirect("/retrievesongreview");
	}

});

router.get("/songreview", async function create(req, res) {
	// res.sendFile("dynamic/uploads/{{ }}");
	const homedes = await ModelSongReview.findOne({
		where: {
			"feedback": "great"
		}
	});
	console.log("Home page accessed");
	return res.render('createsongreview', {
		homedescription: homedes.homedescription,
	                   
		questions: "Ending in 2 days!",
		answers: "Coming Soon!",
	
	});

});
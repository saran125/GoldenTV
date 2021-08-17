import { Router } from 'express';
import { flashMessage } from '../../utils/flashmsg.mjs'
import {ModelReview} from '../../data/review.mjs';
import {ModelUser} from '../../data/user.mjs';
import { ModelRoomInfo } from '../../data/roominfo.mjs';
import { ModelMovieInfo } from '../../data/movieinfo.mjs';
import { ModelSongInfo } from '../../data/songinfo.mjs';
import ORM from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
const CLIENT_ID = '606882834321-g960n5vid466qrmtpcrvno3n8mm97ui0.apps.googleusercontent.com';
const CLEINT_SECRET = 'K8h_BPNEEODlMANw1uueD0IM';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04oD9XpKmvyYOCgYIARAAGAQSNwF-L9IruXKPRKKl1dnfMJGZRXlccxmQxub8JabPtXvr3Hs4SfH-vEMUq20VQwH5A6sGzLEPHkk';
const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLEINT_SECRET,
	REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
router.get("/retrievereview", view_reviewpage);
router.get("/retrievecustomerreview/:type/:id",async function(req, res){
	console.log("Retrieve customer rendered")
	let movie = false;
	let song = false;
	let room = false;
	console.log(`${req.params.id}`);
	if (req.params.type == 'Movie') {
		const detail = await ModelMovieInfo.findByPk(req.params.id);
		console.log('feedback for movie')
		movie = true
		return res.render("user/retrievecustomerreview", {movie, type: req.params.type, detail, id: req.params.id  });
	}
	if (req.params.type == 'Karaoke') {
		const detail = await ModelSongInfo.findByPk(req.params.id);
		console.log('feedback for songs')
		song = true
		return res.render("user/retrievecustomerreview", {song, type: req.params.type, detail, id: req.params.id  });
	}
	if (req.params.type == 'Room') {
		const detail = await ModelRoomInfo.findByPk(req.params.id);
		console.log('feedback for rooms')
		room = true
		return res.render("user/retrievecustomerreview", {room, type: req.params.type, detail,id:req.params.id  });
	}
	
});
// cutomer have to login bef give review
router.get("/create/:type/:id", async function (req, res) {
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'customer') {
    console.log("review page accessed");
	let movie = false;
	let song = false;
	let room = false;
	if(req.params.type == 'Movie'){
		movie = true
		const detail = await ModelMovieInfo.findByPk(req.params.id);
		console.log('feedback for movie')
		return res.render('user/create', {movie, detail,type:req.params.type,id:req.params.id});
	}
	if (req.params.type == 'Karaoke') {
		song = true
		const detail = await ModelSongInfo.findByPk(req.params.id);
		console.log('feedback for songs')
		return res.render('user/create', {song, detail, type: req.params.type, id: req.params.id });
	}
	if (req.params.type == 'Room') {
		room = true
		const detail = await ModelRoomInfo.findByPk(req.params.id);
		console.log('feedback for songs')
		return res.render('user/create', {room, detail, type: req.params.type, id: req.params.id });
	}
		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
});

router.post("/create/:type/:id", async function (req, res) {
    const roomlist = await ModelReview.create({
        "rating": req.body.Rating,
        "feedback": req.body.feedback,
        "TypeReview": req.params.type,
		"type_id":req.params.id,
		"user_id":req.user.uuid,
    });
    console.log("review contents received");
    console.log(roomlist);
    let errors = [];
    if (errors.length > 0) {
        flashMessage(res, 'error', 'Invalid review!', 'fas fa-sign-in-alt', true);
        return res.redirect(req.originalUrl);
    }
    else {
        flashMessage(res, 'success', 'Successfully created a review!', 'fas fa-sign-in-alt', true);
        return res.redirect("/home");
    }
});

async function view_reviewpage(req, res) {
	console.log("retrieve review page accessed");
	try {
	  return res.render("admin/retrievereview", {
	  });
	} catch (error) {
	  console.error("Failed to accesss retrieve review page");
	  console.error(error);
	  return res.status(500).end();
	}
  }

router.post("/deletereview/:uuid", async function (req, res){
	console.log("contents deleted")
	console.log(req.body);
	ModelReview.findOne({
		where: {
			uuid : req.params.uuid
		},
	}).then((dreview)=>{
		if (dreview != null){
		ModelReview.destroy({
			where:{
				uuid:req.params.uuid
			}
		})
		return res.redirect("/review/retrievereview");
	}
	
});
});
//retrieve and delete for customer review
router.post("/deletereview/:uuid", async function (req, res){
	console.log("contents deleted")
	console.log(req.body);
	ModelReview.findOne({
		where: {
			uuid : req.params.uuid
		},
	}).then((dreview)=>{
		if (dreview != null){
		ModelReview.destroy({
			where:{
				uuid:req.params.uuid
			}
			
		})
		return res.redirect("/review/retrievecustomerreview");
	}
	
});
});
router.get("/replyreview/:feedback",async function(req, res){
	console.log("Reply reviewrendered")
	const feedback= await ModelReview.findOne(	
	{
		where:{
			uuid : req.params.feedback
		}
	});
	
	const user = await ModelUser.findByPk(feedback.user_id);
	console.log(user);
	let movie = false;
	let song = false;
	let room = false;
	if (feedback.TypeReview == 'Movie') {
		movie = true
		const detail = await ModelMovieInfo.findByPk(feedback.type_id);
		console.log('feedback for movie')
		return res.render("admin/replyreview", { feedback, user,movie,detail })
	}
	if (feedback.TypeReview == 'Karaoke') {
		song = true
		const detail = await ModelSongInfo.findByPk(feedback.type_id);
		console.log('feedback for songs')
		return res.render("admin/replyreview", { feedback, user, song, detail })
	}
	if (feedback.TypeReview == 'Room') {
		room = true
		const detail = await ModelRoomInfo.findByPk(feedback.type_id);
		console.log('feedback for songs')
		return res.render("admin/replyreview", { feedback, user, room, detail })
	}
});
router.post("/replyreview/:feedback", async function (req, res) {
	console.log("Reply reviewrendered");
	console.log(req.body);
	const Reply= await ModelReview.update({
		"reply"		: req.body.reply,
	},{
		where:{
			uuid : req.params.feedback
		}
	});
	const message  = await ModelReview.findOne(
		{
			where: {
				uuid: req.params.feedback
			}
		});
	const user = await ModelUser.findByPk(message.user_id);
	console.log(user);
	const accessToken = await oAuth2Client.getAccessToken();
	const transport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: 'nypgoldentv@gmail.com',
			clientId: CLIENT_ID,
			clientSecret: CLEINT_SECRET,
			refreshToken: REFRESH_TOKEN,
			accessToken: accessToken,
		},
	});
	//	Send email using google
	transport.sendMail({
		to: user.email,
		from: 'Golden Tv',
		subject: `Review Replied`,
		html: `
		<style>
@import url(https://fonts.googleapis.com/css?family=Roboto);
@import url(https://fonts.googleapis.com/css?family=Handlee);

body {
    margin: 40px 0 0;
    background: #91D1D3;
    font-family: 'Roboto', sans-serif;
}

.paper {
    position: relative;
    width: 90%;
    max-width: 800px;
    min-width: 400px;
    height: 480px;
    margin: 0 auto;
    background: #fafafa;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    overflow: hidden;
}
.paper:before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 60px;
    background: radial-gradient(#575450 6px, transparent 7px) repeat-y;
    background-size: 30px 30px;
    border-right: 3px solid #D44147;
    box-sizing: border-box;
}

.paper-content {
    position: absolute;
    top: 30px; right: 0; bottom: 30px; left: 60px;
    background: linear-gradient(transparent, transparent 28px, #91D1D3 28px);
    background-size: 30px 30px;
}

.paper-content textarea {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    line-height: 30px;
    padding: 0 10px;
    border: 0;
    outline: 0;
    background: transparent;
    color: mediumblue;
    font-family: 'Handlee', cursive;
    font-weight: bold;
    font-size: 18px;
    box-sizing: border-box;
    z-index: 1;
}
</style>
<div class="paper">
    <div class="paper-content">
        <textarea disabled autofocus>Golden TV!&#10;
		Hello ${user.name}!&#10;
		${req.body.reply}&#10;
		from our ${req.user.role}, ${req.user.name}&#10;
		replied for review about ${message.feedback}.
		</textarea>
		<div class="aligncenter content-block">Questions? Email <a
        href="mailto:">nypgoldentv@gmail.com</a>
        </div>
		<div class="aligncenter content-block">Or <a
        href="http://localhost:3000/">Visit Our Website</a>
        </div>
    </div>
</div>


		`
	});
	console.log('message emailed..')
	console.log("Reply contents received");
	console.log(Reply);
	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	if (errors.length > 0) {
		flashMessage(res, 'error', 'Invalid faq!', 'fas fa-sign-in-alt', true);
		return res.redirect(req.originalUrl);
	}
	else {
		
		return res.redirect("/review/retrievereview");
	}
});

router.get("/updatecustomerreview/:uuid",async function(req, res){
	try {
		let user = req.user.uuid;
		console.log(user);
	
	return res.render("user/updatecustomerreview", {
		id:req.params.uuid});
	
		
		}
	catch (error) {
			return res.render('404');
		};
});

// post method cannot access easily
router.post("/updatecustomerreview/:uuid", async function (req, res) {
	console.log("update review contents received");
	console.log(req.body);
	const UCR = await ModelReview.update({
		"rating"		: req.body.Rating,
		"feedback"      : req.body.feedback,
	},{
		where:{
			uuid : req.params.uuid
		}
	}); 

	console.log("Update customer review contents received");
	console.log(UCR);
	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	if (errors.length > 0) {
		flashMessage(res, 'error', 'Invalid update!', 'fas fa-sign-in-alt', true);
		return res.redirect(req.originalUrl);
	}
	else {
		
		return res.redirect("/home")
	}
});
router.post("/deletecustomerreview/:uuid", async function (req, res){
	console.log("contents deleted")
	console.log(req.body);
	ModelReview.findOne({
		where: {
			uuid:req.params.uuid
		},
	}).then((creview)=>{
		if (creview != null){
		ModelReview.destroy({
			where:{
				uuid:req.params.uuid
			}
			
		})
		return res.redirect("/home");
	}
	
});
});

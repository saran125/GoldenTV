import { Router } from 'express';
import { flashMessage } from '../../utils/flashmsg.mjs'
import {ModelReview} from '../../data/review.mjs';
import {ModelUser} from '../../data/user.mjs';
import ORM from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
const CLIENT_ID = '606882834321-g960n5vid466qrmtpcrvno3n8mm97ui0.apps.googleusercontent.com';
const CLEINT_SECRET = 'ddcxoBS7eD1MK4iMlqSHItvq';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04kNCsE6pIn8-CgYIARAAGAQSNwF-L9Ir4cYR9uueroLFBr7H2IPRf_f7M00FGbkFTpOmQvKkDdbSvEiqyr_2kEZa5lkRSXG7yr4';
const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLEINT_SECRET,
	REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
router.get("/retrievereview", view_reviewpage);
router.get("/retrievecustomerreview/:TypeReview",async function(req, res){
	console.log("Retrieve customer rendered")
	return res.render("user/retrievecustomerreview",{TypeReview:req.params.TypeReview})
});

router.get("/create/:type", async function (req, res) {
    console.log("review page accessed");
    return res.render('user/create',{detail:req.params.type});
});
router.post("/create/:type", async function (req, res) {
    const roomlist = await ModelReview.create({
        "rating": req.body.Rating,
        "feedback": req.body.feedback,
        "TypeReview": req.params.type,
		"user_id":req.user.uuid,
    });
    console.log("review contents received");
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

router.get("/table",async function(req, res) {
	console.log("table contents received")
	console.log(req.body);
});
router.get("/table-data",async function(req, res){
	console.log("table-data contents received")
	console.log(req.body);
});
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


async function view_customerreview(req, res) {
	console.log("retrieve review page accessed");
	try {
	  return res.render("user/retrievecustomerreview", {
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
		return res.redirect("/review/retrievecustomerreview");
	}
	
});
});
router.get("/replyreview/:feedback",async function(req, res){
	console.log("Reply reviewrendered")
	const Reply= await ModelReview.findOne(	
	{
		where:{
			uuid : req.params.feedback
		}
	});
	const user = await ModelUser.findByPk(Reply.user_id);
	console.log(user);
	return res.render("admin/replyreview",{feedback:Reply, user})
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
import { Router } from 'express';
import { flashMessage } from '../../utils/flashmsg.mjs'
import {ModelReview} from '../../data/review.mjs';
import ORM from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

router.get("/retrievereview", view_reviewpage);



router.get("/retrievecustomerreview/:TypeReview",async function(req, res){
	console.log("Retrieve customer rendered")
	return res.render("user/retrievecustomerreview",{TypeReview:req.params.TypeReview})
});

router.get("/create", async function (req, res) {
    console.log("review page accessed");
    return res.render('user/create');
});
router.post("/create", async function (req, res) {
    const roomlist = await ModelReview.create({
        "rating": req.body.Rating,
        "feedback": req.body.feedback,
        "TypeReview": req.body.TypeReview,
		//"user_id":req.user.uuid,
		"user_id":"kumar",
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

	return res.render("admin/replyreview",{feedback:Reply})
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
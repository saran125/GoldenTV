import { Router }       from 'express';
import {ModelFaq} from '../../data/faq.mjs';
import { flashMessage } from '../../utils/flashmsg.mjs';
import Routerfaq from './faq.mjs';
import ORM from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;

router.get("/retrievefaq", view_faqpage);

router.get("/faq", function(req, res){
	console.log('faq adding is accessed');
	return res.render('admin/createfaq');
})

router.post("/faq", async function (req, res) {
	console.log("faq contents received");
	console.log(req.body);
	let array = Array.isArray(req.body.questions);
	if (array == false) {
		const Faq = await ModelFaq.create({
			"questions": req.body.questions,
			"answers": req.body.answers,
		});
		console.log(Faq);
	}
	if (array == true) {
		for (let i = 0; i < req.body.questions.length; i++) {
			const Faq = await ModelFaq.create({
				"questions": req.body.questions[i],
				"answers": req.body.answers[i],
			})
			console.log(Faq);
		}
	}
	console.log(array);
	console.log("Faq contents received");
	
	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	if (errors.length > 0) {
		flashMessage(res, 'error', 'Invalid faq!', 'fas fa-sign-in-alt', true);
		return res.redirect(req.originalUrl);
	}
	else {
		flashMessage(res, 'success', 'Successfully created a faq!', 'fas fa-sign-in-alt', true);
		return res.redirect("/faq/retrievefaq");
	}

});
/**
 * Renders the retrieve page
 * @param {import('express')Request}  req Express Request handle
 * @param {import('express')Response} res Express Response handle
 */
// admins to see
 async function view_faqpage(req, res) {
	console.log("retrieve page accessed");
	 try {
		 let user = req.user.uuid;
		 console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager' ) {
	try {
	  return res.render("admin/retrievefaq", {
	  });
	} 
	catch (error) {
	  console.error("Failed to accesss retrieve faq page");
	  console.error(error);
	  return res.status(500).end();
	}
	}
		 else { return res.render('404'); }
	 }
	 catch (error) {
		 return res.render('404');
	 };
}
// admin 
router.get("/updatefaq/:questions",async function(req, res){
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff' || req.user.role == 'manager' ) {
	console.log("Update Faq rendered")
	return res.render("admin/updatefaq",{questions:req.params.questions})
		}
	else { return res.render('404'); }
		}
	catch (error) {
			return res.render('404');
		};
});
// post method cannot access easily
router.post("/updatefaq/:questions", async function (req, res) {
	console.log("update faq contents received");
	console.log(req.body);
	const Faq = await ModelFaq.update({
		"answers"		: req.body.answers,
	},{
		where:{
			questions : req.params.questions
		}
	});

	console.log("Faq contents received");
	console.log(Faq);
	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	if (errors.length > 0) {
		flashMessage(res, 'error', 'Invalid faq!', 'fas fa-sign-in-alt', true);
		return res.redirect(req.originalUrl);
	}
	else {
		
		return res.redirect("/faq/retrievefaq");
	}
});
// get method easy to access
router.get("/deletefaq/:questions", async function (req, res){
	try {
		let user = req.user.uuid;
		console.log(user);
		if (req.user.role == 'staff'|| req.user.role == 'manager') {
	console.log("contents deleted")
	console.log(req.body);
	ModelFaq.findOne({
		where: {
			questions : req.params.questions
		},
	}).then((dfaq)=>{
		if (dfaq != null){
		ModelFaq.destroy({
			where:{
				questions:req.params.questions
			}
			
		})
		return res.redirect("/faq/retrievefaq");
	}
	
});
		}
		else { return res.render('404'); }
	}
	catch (error) {
		return res.render('404');
	};
});
router.get("/cfaq", async function faq(req, res) {
	// res.sendFile("dynamic/uploads/{{ }}");
	const homedes = await ModelFaq.findAll({
		raw:true
	});
	console.log("Home page accessed");
	return res.render('cfaq', {
		homedes
	});

});
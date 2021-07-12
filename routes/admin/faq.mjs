import { Router }       from 'express';
import {ModelFaq} from '../../data/faq.mjs';
import { flashMessage } from '../../utils/flashmsg.mjs';
import ORM from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;
const router = Router();
export default router;
router.get("/retrievefaq", view_faqpage);
router.get("/faq", function (req, res) {
	console.log("faq page accessed");
	return res.render('admin/createfaq');
});
router.post("/faq", async function (req, res) {
	console.log("faq contents received");
	console.log(req.body);
	const Faq = await ModelFaq.create({
		"questions": req.body.questions,
		"answers": req.body.answers,
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
		flashMessage(res, 'success', 'Successfully created a faq!', 'fas fa-sign-in-alt', true);
		return res.redirect("/faq/retrievefaq");
	}
});
async function view_faqpage(req, res) {
	const faq = await ModelFaq.findAll({
		where: {
			"questions": {
				[Op.ne]: "null"
			}
		}
	});
	return res.render('admin/retrievefaq', { faq: faq })
}

router.get("/table", async function (req, res) {
	console.log("table contents received")
	console.log(req.body);
});
router.get("/table-data", async function (req, res) {
	console.log("table-data contents received")
	console.log(req.body);
});
router.get("/updatefaq/:questions", async function (req, res) {
	console.log("Update Faq rendered")
	return res.render("updatefaq", { questions: req.params.questions })
});
router.post("/updatefaq/:questions", async function (req, res) {
	console.log("update faq contents received");
	console.log(req.body);
	const Faq = await ModelFaq.update({
		"answers": req.body.answers,
	}, {
		where: {
			questions: req.params.questions
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
		flashMessage(res, 'success', 'Successfully updated a faq!', 'fas fa-sign-in-alt', true);
		return res.redirect("/faq/retrievefaq");
	}
});
router.get("/deletefaq/:questions", async function (req, res) {
	console.log("contents deleted")
	console.log(req.body);
	ModelFaq.findOne({
		where: {
			questions: req.params.questions
		},
	}).then((dfaq) => {
		if (dfaq != null) {
			ModelFaq.destroy({
				where: {
					questions: req.params.questions
				}

			})
			return res.redirect("/faq/retrievefaq");
		}

	});
});
router.get("/testout", async function (req, res) {
	console.log("Index page accessed");
	return res.render("testout", {

	});
});

router.post("/testout", async function (req, res) {
	console.log("Index contents received");
	console.log(req.body);

});
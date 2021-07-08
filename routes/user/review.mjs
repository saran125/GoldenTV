import { Router } from 'express';
import { ModelFaq } from '../../data/faq.mjs';
import { flashMessage } from '../../utils/flashmsg.mjs'
const router = Router();
export default router;
router.get("/create", async function (req, res) {
    console.log("review page accessed");
    return res.render('review/create');
});
router.post("/create", async function (req, res) {
    const roomlist = await ModelReview.create({
        "rating": req.body.Rating,
        "feedback": req.body.feedback,
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
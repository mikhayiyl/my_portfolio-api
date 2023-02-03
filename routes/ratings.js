const router = require("express").Router();
const starRate = require("star-ratings");
const { validate, Rate } = require("../models/rating");
const validator = require("../middleware/validate");

router.get('/', async (req, res) => {
    const ratings = await Rate.find().sort("-createdAt");
    res.send(ratings)
})
router.get('/rates/:id', async (req, res) => {
    const rates = await Rate.find(
        { project: req.params.id }
    );
    const ratings = starRate(rates.map(rate => rate.rate))
    res.send(ratings)
})


//individual rate
router.get('/rate', async (req, res) => {
    const rated = await Rate.findOne({ email: req.body.email, project: req.body.project });
    if (!rated) return res.send({
        rate: 0,
    });
    const rate = rated.rate;
    res.send(rate);
})




//check if rated
router.get('/rated', async (req, res) => {
    const rate = await Rate.findOne({ email: req.body.email, project: req.body.project });
    if (!rate) return res.status(200).send(false);
    res.send(true)
})


//create a rating 

router.post("/", validator(validate), async (req, res) => {
    let rate = await Rate.findOne({ email: req.body.email, project: req.body.project });
    if (rate) {
        await rate.update({ rate: req.body.rate })
        return res.send(rate);
    } else {
        rate = new Rate(req.body);
        await rate.save();
        res.send(rate);

    }
});



module.exports = router;


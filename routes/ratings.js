const router = require("express").Router();
const starRate = require("star-ratings");
const { validate, Rate } = require("../models/rating");
const validator = require("../middleware/validate");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//get all ratings

router.get('/', async (req, res) => {
    const rates = await Rate.find();
    const ratings = starRate(rates.map(rate => rate.rate))
    res.send(ratings)
})

//individual rate
router.put('/rate/:id', async (req, res) => {
    const rated = await Rate.findOne({ userId: req.params.id, project: req.body.project });
    if (!rated) return res.send({
        rate: 0,
    });
    const rate = rated.rate;
    res.send(rated);
})




//check if rated
router.put('/:id', async (req, res) => {
    const rate = await Rate.findOne({ userId: req.params.id, project: req.body.project });
    if (!rate) return res.status(200).send(false);
    res.send(true)
})


//create a rating 

router.post("/", [validator(validate)], async (req, res) => {
    let rate = await Rate.findOne({ userId: req.body.userId, project: req.body.project });
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


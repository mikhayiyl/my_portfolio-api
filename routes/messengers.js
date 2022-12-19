const router = require("express").Router();
const { validate, Messenger } = require("../models/messenger");
const validator = require("../middleware/validate");
const auth = require("../middleware/auth");



//get messages 

router.get("/", [auth], async (req, res) => {
    const messages = await Messenger.find()
    res.send(messages);
});



//new message 
router.post("/", [auth, validator(validate)], async (req, res) => {
    const message = new Messenger(req.body)

    await message.save();

    res.send(message);
});




module.exports = router;
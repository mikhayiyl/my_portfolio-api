const router = require("express").Router();
const { validate, Message } = require("../models/message");
const validator = require("../middleware/validate");


router.post("/", validator(validate), async (req, res) => {
    const message = new Message(req.body);
    await message.save();

    res.send(message);

})




module.exports = router;
const router = require("express").Router();
const { validate, Message } = require("../models/message");
const validator = require("../middleware/validate");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");



//get messages by chatId

router.get("/:id", [auth, objId], async (req, res) => {
    const messages = await Message.find(
        {
            conversationId: req.params.id,
        }
    )
    if (!messages)
        return res.status(404).send("The messages with the given Id were not found");
    res.send(messages);
});



//new message
router.post("/", [auth, validator(validate)], async (req, res) => {
    const message = new Message(req.body)

    await message.save();

    res.send(message);
});




module.exports = router;
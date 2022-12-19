const router = require("express").Router();
const { validate, Message } = require("../models/message");
const validator = require("../middleware/validate");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");



//get  unread messages 

router.get("/unread/:id", [auth, objId], async (req, res) => {
    const messages = await Message.find({ read: false, recipient: req.params.id });

    res.send(messages);
});

//total unread messages in a chat
router.get("/unreadchats/:userId/:chatId", [auth], async (req, res) => {
    const messages = await Message.find({ read: false, recipient: req.params.userId, conversationId: req.params.chatId });
    res.send(messages);
});


//mark messages as read;

router.put("/read/:id", [auth, objId], async (req, res) => {
    const messages = await Message.updateMany({ read: false, recipient: req.params.id, sender: req.body.senderId }, { read: true });
    res.send(messages);
});

//get messages by chatId

router.get("/:id", [auth, objId], async (req, res) => {
    const messages = await Message.find(
        {
            conversationId: req.params.id,
        }
    )

    res.send(messages);
});



//new message
router.post("/", [auth, validator(validate)], async (req, res) => {
    const message = new Message(req.body)

    await message.save();

    res.send(message);
});




module.exports = router;
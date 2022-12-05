const router = require("express").Router();
const { validate, Conversation } = require("../models/conversation");
const validator = require("../middleware/validate");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");



//get converstion

router.get("/:id", [auth, objId], async (req, res) => {
    const conversation = await Conversation.find(
        {
            users: { $in: [req.params.id] }
        }
    ).sort('-createdAt').select('-__v');
    if (!conversation)
        return res.status(404).send("The conversation with the given Id is not found");
    res.send(conversation);
});
//a specific converstion

router.get("/find/:currentUserId/:friendId", [auth], async (req, res) => {
    let conversation = await Conversation.findOne(
        {
            users: { $all: [req.params.currentUserId, req.params.friendId] }
        }
    ).sort('-createdAt').select('-__v');
    if (!conversation) {

        conversation = new Conversation({
            users: [req.params.currentUserId, req.params.friendId],
        })

        await conversation.save();
    }
    res.send(conversation);
});




//new conversation
router.post("/", [auth, validator(validate)], async (req, res) => {
    let conversation = await Conversation.findOne(
        {
            users: { $all: [req.body.senderId, req.body.receiverId] }
        }
    ).sort('-createdAt').select('-__v');

    if (conversation) return res.status(404).send("The conversation already exists")


    conversation = new Conversation({
        users: [req.body.senderId, req.body.receiverId],
    })

    await conversation.save();

    res.send(conversation);
});




module.exports = router;
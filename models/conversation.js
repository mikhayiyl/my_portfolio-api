const mongoose = require("mongoose");
const Joi = require("joi");

const conversationSchema = new mongoose.Schema(
    {
        users: {
            type: Array,
        },


    },

    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

function validateChat(chat) {
    const schema = {
        senderId: Joi.objectId().required(),
        receiverId: Joi.objectId().required(),
    };
    return Joi.validate(chat, schema);


}

module.exports.Conversation = Conversation;
module.exports.validate = validateChat;

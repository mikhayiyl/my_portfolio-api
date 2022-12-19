const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
        },
        sender: {
            type: String,
        },
        recipient: {
            type: String,
        },
        text: {
            type: String,
        },

        read: {
            type: Boolean,
            default: false,
        }


    },

    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

function validateMessage(Message) {
    const schema = {
        conversationId: Joi.objectId().required(),
        sender: Joi.objectId().required(),
        recipient: Joi.objectId().required(),
        text: Joi.string().required(),
    };
    return Joi.validate(Message, schema);


}

module.exports.Message = Message;
module.exports.validate = validateMessage;

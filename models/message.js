const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,

        },
        email: {
            type: String,
            required: true,

        },
        text: {
            type: String,
            required: true,

        },



    },

    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

function validateMessage(Message) {
    const schema = {
        username: Joi.string().required(),
        email: Joi.string().required(),
        text: Joi.string().required(),
    };
    return Joi.validate(Message, schema);


}

module.exports.Message = Message;
module.exports.validate = validateMessage;

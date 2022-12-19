const mongoose = require("mongoose");
const Joi = require("joi");

const messengerSchema = new mongoose.Schema(
    {
        senderEmail: {
            type: String,
            required: true,
            maxlength: 50
        },

        text: {
            type: String,
            required: true,
            maxlength: 255,
        },

        project: {
            type: String,
            required: true,
        }
    },

    { timestamps: true }
);

const Messenger = mongoose.model("Text", messengerSchema);

function validateText(text) {
    const schema = {
        senderEmail: Joi.string().required(),
        text: Joi.string().required(),
        project: Joi.string().required(),
    };
    return Joi.validate(text, schema);


}

module.exports.Messenger = Messenger;
module.exports.validate = validateText;

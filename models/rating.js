const mongoose = require("mongoose");
const Joi = require("joi");

const rateSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },

        rate: {
            type: Number,
            required: true,
        },
        project: {
            type: String,
            required: true,

        }
    }
);

const Rate = mongoose.model("Rate", rateSchema);


function validateRate(rate) {
    const schema = {
        project: Joi.string().required(),
        email: Joi.string().required(),
        rate: Joi.number().required(),
    }

    return Joi.validate(rate, schema);
}


module.exports.Rate = Rate;
module.exports.validate = validateRate;

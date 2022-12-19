const mongoose = require("mongoose");
const Joi = require("joi");

const rateSchema = new mongoose.Schema(
    {
        userId: {
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

const validateRate = (rate) => {
    const schema = {
        userId: Joi.objectId().required(),
        rate: Joi.number(),
        project: Joi.string(),
    };
    return Joi.validate(rate, schema);

}

module.exports.Rate = Rate;
module.exports.validate = validateRate;

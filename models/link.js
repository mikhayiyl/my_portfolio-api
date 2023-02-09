const mongoose = require('mongoose');
const Joi = require("joi");

const Link = mongoose.model("Link", new mongoose.Schema({
    fbLink: {
        type: String,
        required: true,
        unique: true,
        maxLength: 1024
    },
    twLink: {
        type: String,
        required: true,
        unique: true,
        maxLength: 1024
    },
    gitLink: {
        type: String,
        required: true,
        unique: true,
        maxLength: 1024
    },
    instLink: {
        type: String,
        required: true,
        unique: true,
        maxLength: 1024
    },
}))

function validateLink(link) {
    const schema = {
        fbLink: Joi.string().required().max(1024),
        twLink: Joi.string().required().max(1024),
        gitLink: Joi.string().required().max(1024),
        instLink: Joi.string().required().max(1024),
    }

    return Joi.validate(link, schema)
}

exports.Link = Link;
exports.validate = validateLink;
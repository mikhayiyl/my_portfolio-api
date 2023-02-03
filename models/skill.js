const Joi = require('joi');
const mongoose = require('mongoose');

const Skill = mongoose.model('Skill', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    percent: {
        type: Number,
        min: 0,
        max: 100
    },

    skills: {
        type: Array,
        default: []
    },


},
    { timestamps: true }

));

function validateSkill(skill) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        percent: Joi.number().min(20).max(100),
        skill: Joi.string().max(255),
    };

    return Joi.validate(skill, schema);
}

exports.Skill = Skill;
exports.validate = validateSkill;
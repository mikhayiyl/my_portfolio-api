const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        likes: {
            type: Array,
            default: [],
        },

        replies: {
            type: Array,
            default: []
        },
        spam: {
            type: Boolean,
            default: false
        },

    },

    { timestamps: true }
);

const Comment = mongoose.model("Comment", postSchema);

function validate(post) {
    const schema = {
        postId: Joi.objectId().required(),
        userId: Joi.objectId().required(),
        text: Joi.string().required(),
        createdAt: Joi.number().required(),
        reply: Joi.string(),
    };
    return Joi.validate(post, schema);

}

module.exports.Comment = Comment;
module.exports.validate = validate;

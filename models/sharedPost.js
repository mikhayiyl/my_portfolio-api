const mongoose = require("mongoose");
const Joi = require("joi");



const sharedPost = mongoose.model("sharedPost", new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
        },
    },

    { timestamps: true }
));

function validatePost(post) {
    const schema = {
        userId: Joi.objectId().required(),
        postId: Joi.objectId().required(),
    };
    return Joi.validate(post, schema);


}

module.exports.sharedPost = sharedPost;
module.exports.validate = validatePost;

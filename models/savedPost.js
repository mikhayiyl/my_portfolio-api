const mongoose = require("mongoose");
const Joi = require("joi");


const saveSchema = new mongoose.Schema(
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
);

const savePost = mongoose.model("savedPost", saveSchema);

function validatePost(post) {
    const schema = {
        userId: Joi.objectId().required(),
        postId: Joi.objectId().required(),
    };
    return Joi.validate(post, schema);


}

module.exports.savePost = savePost;
module.exports.validate = validatePost;

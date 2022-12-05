const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 255,
    },
    media: {
      name: String,
      filename: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    spam: {
      type: Boolean,
      default: false
    },

  },

  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = {
    userId: Joi.objectId().required(),
    description: Joi.string(),
  };
  return Joi.validate(post, schema);


}

module.exports.Post = Post;
module.exports.postSchema = postSchema;
module.exports.validate = validatePost;

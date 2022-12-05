const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
    profilePicture: {
      type: String,
      default: "user.png",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    images: {
      type: Array,
      default: [],
    },
    friendRequests: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
      maxlength: 50,
      default: ""
    },
    city: {
      type: String,
      maxlength: 50,
      default: ""
    },
    from: {
      type: String,
      maxlength: 50,
      default: ""
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
      default: 3
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      isAdmin: this.isAdmin,
      profilePicture: this.profilePicture,
      coverPicture: this.coverPicture,
      friends: this.friends,
      friendRequests: this.friendRequests,
      followers: this.followers,
      following: this.following,
      description: this.description,
      city: this.city,
      city: this.images,
      from: this.from,
      relationship: this.relationship,
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validate(user) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).required(),
    password2: Joi.string().min(5).required(),
    profilePicture: Joi.string(),
    coverPicture: Joi.string(),
    isAdmin: Joi.boolean(),
    description: Joi.string().max(50),
    city: Joi.string().max(50),
    from: Joi.string().max(50),
    relationship: Joi.number(),
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validate;

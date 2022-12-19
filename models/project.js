const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Project = mongoose.model('Project', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  genre: {
    type: genreSchema,
    required: true
  },

  url: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 255
  },

  features: {
    type: Array,
    default: []
  },

  images: {
    type: Array,
    default: []
  },

},
  { timestamps: true }

));

function validateProject(project) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    url: Joi.string().max(255).required(),
    description: Joi.string().max(255),
    feature: Joi.string().max(255),
    image: Joi.string().max(255),
  };

  return Joi.validate(project, schema);
}

exports.Project = Project;
exports.validate = validateProject;
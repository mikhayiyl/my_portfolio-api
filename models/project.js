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

  gitUrl: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  projectUrl: {
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
  rating: {
    type: Number,
    default: 1.5
  },
  technologies: {
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
    gitUrl: Joi.string().max(1000).required(),
    projectUrl: Joi.string().max(100).required(),
    description: Joi.string().max(255).required(),
    feature: Joi.string().max(255),
    image: Joi.string().max(255),
    technology: Joi.string().max(255),
  };

  return Joi.validate(project, schema);
}

exports.Project = Project;
exports.validate = validateProject;
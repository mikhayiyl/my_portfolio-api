const morgan = require("morgan");
const express = require("express");
const auth = require('../routes/auth');
const conversations = require('../routes/conversations');
const genres = require('../routes/genres');
const messages = require('../routes/messages');
const projects = require('../routes/projects');
const ratings = require('../routes/ratings');
const users = require('../routes/users');
const skills = require('../routes/skills');
const links = require('../routes/links');
const errors = require('../middleware/error');


module.exports = function (app) {
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use('/api/auth', auth);
  app.use('/api/conversations', conversations);
  app.use('/api/genres', genres);
  app.use('/api/messages', messages);
  app.use('/api/projects', projects);
  app.use('/api/ratings', ratings);
  app.use('/api/users', users);
  app.use('/api/skills', skills);
  app.use('/api/links', links);
  app.use(errors);
}
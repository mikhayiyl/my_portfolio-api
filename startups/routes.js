const morgan = require("morgan");
const express = require("express");
const auth = require('../routes/auth');
const conversations = require('../routes/conversations');
const genres = require('../routes/genres');
const messages = require('../routes/messages');
const messenger = require('../routes/messengers');
const projects = require('../routes/projects');
const ratings = require('../routes/ratings');
const users = require('../routes/users');
const errors = require('../middleware/error');


module.exports = function (app) {
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use('/api/auth', auth);
  app.use('/api/conversations', conversations);
  app.use('/api/genres', genres);
  app.use('/api/messages', messages);
  app.use('/api/messenger', messenger);
  app.use('/api/projects', projects);
  app.use('/api/ratings', ratings);
  app.use('/api/users', users);
  app.use(errors);
}
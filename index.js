const express = require("express");
require("express-async-errors");
const config = require("config");
const morgan = require("morgan");
const winston = require("winston");
const cors = require("cors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const socketIo = require("socket.io");
const { createServer } = require("http");


const app = express();
const server = createServer(app)
const io = socketIo(server, { cors: { origin: "*" } });
require("./socket/index")(io);
require("./startups/prod")(app);

const mongoose = require("mongoose");
const auth = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");
const savedPosts = require("./routes/savedPosts");
const comments = require("./routes/comments");
const uploads = require("./routes/uploads");
const conversations = require("./routes/conversations");
const messages = require("./routes/messages");
const sharedPosts = require("./routes/sharedPosts");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const db = process.env.DB || config.get("db");

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(winston.info(`connecting ${db}...`))
  .catch((ex) => winston.error(ex.message, ex));


const newr = express.static(path.join(__dirname, 'routes/public'))
app.use("/images", newr);
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/posts", posts);
app.use("/api/savepost", savedPosts);
app.use("/api/sharepost", sharedPosts);
app.use("/api/uploads", uploads);
app.use("/api/comments", comments);
app.use("/api/messages", messages);
app.use("/api/conversations", conversations);




const port = process.env.PORT || config.get("port");

server.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);











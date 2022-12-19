const express = require('express');
const winston = require('winston');

const app = express();

const port = process.env.PORT || 5000;


require("./startups/config")();
require("./startups/mongodb")();
require("./startups/prod")(app);
require("./startups/cors")(app);
require("./startups/routes")(app);
require("./startups/validation")();
require("./startups/errorLogs")();

app.listen(port, () => winston.info(`Listening on port ${port}...`));
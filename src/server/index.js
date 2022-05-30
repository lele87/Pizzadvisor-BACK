const express = require("express");
const { notFoundError, generalError } = require("./middlewares/errors");

const app = express();

app.use(notFoundError);
app.use(generalError);

module.exports = app;

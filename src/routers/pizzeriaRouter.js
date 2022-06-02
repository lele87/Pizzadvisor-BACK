const express = require("express");

const pizzeriaRouter = express.Router();

pizzeriaRouter.get("/list");

module.exports = pizzeriaRouter;

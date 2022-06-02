const express = require("express");
const getPizzerias = require("../controllers/pizzeriaControllers");

const pizzeriaRouter = express.Router();

pizzeriaRouter.get("/list", getPizzerias);

module.exports = pizzeriaRouter;

const express = require("express");
const {
  getPizzerias,
  deletePizzeria,
} = require("../controllers/pizzeriaControllers");

const pizzeriaRouter = express.Router();

pizzeriaRouter.get("/list", getPizzerias);
pizzeriaRouter.delete("/:id", deletePizzeria);

module.exports = pizzeriaRouter;

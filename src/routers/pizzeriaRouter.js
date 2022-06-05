const express = require("express");
const path = require("path");
const multer = require("multer");
const {
  getPizzerias,
  deletePizzeria,
  createPizzeria,
} = require("../controllers/pizzeriaControllers");

const upload = multer({
  dest: path.join("uploads", "pizzerias"),
});

const pizzeriaRouter = express.Router();

pizzeriaRouter.get("/list", getPizzerias);
pizzeriaRouter.delete("/:idPizzeria", deletePizzeria);
pizzeriaRouter.post("/", upload.single("image"), createPizzeria);

module.exports = pizzeriaRouter;

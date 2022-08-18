const express = require("express");
const path = require("path");
const multer = require("multer");

const {
  getPizzerias,
  deletePizzeria,
  createPizzeria,
  editPizzeria,
  getPizzeria,
} = require("../controllers/pizzeriaControllers");
const auth = require("../server/middlewares/auth");
const imageConverter = require("../server/middlewares/imageConverter");

const upload = multer({
  dest: path.join("uploads", "pizzerias"),
  limits: {
    fileSize: 8000000,
  },
});

const pizzeriaRouter = express.Router();

pizzeriaRouter.get("/list", auth, getPizzerias);
pizzeriaRouter.post(
  "/",
  upload.single("image"),
  imageConverter,
  createPizzeria
);
pizzeriaRouter.patch(
  "/:idPizzeria",
  upload.single("image"),
  imageConverter,
  editPizzeria
);
pizzeriaRouter.delete("/:idPizzeria", deletePizzeria);
pizzeriaRouter.get("/:idPizzeria", getPizzeria);

module.exports = pizzeriaRouter;

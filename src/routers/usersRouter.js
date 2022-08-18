const express = require("express");
const auth = require("../server/middlewares/auth");
const { getUsersFavourites } = require("../controllers/usersControllers");

const usersRouter = express.Router();

usersRouter.get("/:userId", auth, getUsersFavourites);

module.exports = usersRouter;

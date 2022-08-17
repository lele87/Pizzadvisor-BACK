const express = require("express");
const { getUsersFavourites } = require("../controllers/usersControllers");

const usersRouter = express.Router();

usersRouter.get("/:userId", getUsersFavourites);

module.exports = usersRouter;

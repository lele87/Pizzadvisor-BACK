require("dotenv").config();
const debug = require("debug")("pizzadvisor:controllers:pizzeriaControllers");
const chalk = require("chalk");
const Pizzeria = require("../database/models/Pizzeria");
const User = require("../database/models/User");
const customError = require("../utils/customError");

const getUsersFavourites = async (req, res, next) => {
  debug(chalk.yellowBright("New pizzeria's favourite list request received"));
  const { userId } = req.params;

  try {
    const {
      favourites: { pizzerias },
    } = await User.findById(userId).populate({
      path: "favourites",
      populate: {
        path: "pizzerias",
        model: Pizzeria,
      },
    });
    res.status(200).json({ pizzerias });
  } catch {
    const error = customError(400, "Bad request", "Wrong parameters");

    next(error);
  }
};

module.exports = { getUsersFavourites };

require("dotenv").config();
const debug = require("debug")("pizzadvisor:controllers:pizzeriaControllers");
const chalk = require("chalk");
const Pizzeria = require("../database/models/Pizzeria");

const getPizzerias = async (req, res, next) => {
  debug(chalk.yellowBright("New pizzeria's list request received"));
  const pizzerias = await Pizzeria.find();

  if (pizzerias.length === 0) {
    const error = (404, "Pizzerias not found");

    next(error);
    return;
  }
  res.status(200).json(pizzerias);
};

const deletePizzeria = async (req, res) => {
  debug(chalk.yellow("Request to delete a pizzeria"));
  const { idPizzeria } = req.body;

  await Pizzeria.findByIdAndDelete(idPizzeria);
  res.status(200).json({ msg: `Pizzeria with ID ${idPizzeria} deleted` });
};

module.exports = { getPizzerias, deletePizzeria };

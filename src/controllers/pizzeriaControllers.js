require("dotenv").config();
const debug = require("debug")("pizzadvisor:controllers:pizzeriaControllers");
const chalk = require("chalk");
const path = require("path");
const customError = require("../utils/customError");
const Pizzeria = require("../database/models/Pizzeria");

const getPizzerias = async (req, res, next) => {
  debug(chalk.yellowBright("New pizzeria's list request received"));
  try {
    const { filter, limit } = req.query;

    const pizzerias = filter
      ? await Pizzeria.find({ specialty: filter }).limit(limit)
      : await Pizzeria.find().limit(limit);

    const count = filter
      ? await Pizzeria.count({ specialty: filter })
      : await Pizzeria.count();
    const pages = Math.ceil(count / 5);

    res.status(200).json({ pizzerias, pages });
  } catch (error) {
    next(error);
  }
};

const deletePizzeria = async (req, res) => {
  debug(chalk.yellow("Request to delete a pizzeria"));
  const { idPizzeria } = req.params;

  await Pizzeria.findByIdAndDelete(idPizzeria);
  res.status(200).json({ msg: `Pizzeria with ID ${idPizzeria} deleted` });
};

const createPizzeria = async (req, res, next) => {
  try {
    const { name, address, timetable, specialty, owner } = req.body;
    const { file } = req;
    const { firebaseFileURL, newImageName } = req;

    const newPizzeria = await Pizzeria.create({
      name,
      address,
      timetable,
      specialty,
      owner,
      image: file ? path.join("pizzerias", newImageName) : "",
      imageBackup: file ? firebaseFileURL : "",
    });

    debug(chalk.redBright("Pizzeria added to database"));
    res.status(201).json({ newPizzeria });
  } catch {
    const error = customError(400, "Bad Request", "Error creating pizzeria");

    next(error);
  }
};

const editPizzeria = async (req, res, next) => {
  debug(chalk.yellow("Request to edit a pizzeria"));

  try {
    const { idPizzeria } = req.params;
    const { name, address, timetable, specialty, owner } = req.body;
    const { file } = req;
    const { firebaseFileURL, newImageName } = req;

    const pizzeriaOriginalImage = {
      name,
      address,
      timetable,
      specialty,
      owner,
      image: file ? path.join("pizzerias", newImageName) : "",
      imageBackup: file ? firebaseFileURL : "",
    };

    const updatedPizzeria = await Pizzeria.findByIdAndUpdate(
      idPizzeria,
      pizzeriaOriginalImage,
      {
        new: true,
      }
    );

    if (updatedPizzeria) {
      debug(chalk.greenBright("Pizzeria updated"));
    }

    res.status(201).json({ updatedPizzeria });
  } catch {
    const error = customError(400, "Bad Request", "Error updating pizzeria");

    next(error);
  }
};

const getPizzeria = async (req, res, next) => {
  const { idPizzeria } = req.params;
  try {
    const pizzeria = await Pizzeria.findById(idPizzeria);
    debug(
      chalk.yellowBright(`New pizzeria request, id requested:${idPizzeria}`)
    );
    res.status(200).json(pizzeria);
  } catch {
    const error = customError(404, "Bad request", "Pizzeria not found");
    next(error);
  }
};

module.exports = {
  getPizzerias,
  deletePizzeria,
  createPizzeria,
  editPizzeria,
  getPizzeria,
};

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("../routers/userRouter");
const { notFoundError, generalError } = require("./middlewares/errors");
const pizzeriaRouter = require("../routers/pizzeriaRouter");
const usersRouter = require("../routers/usersRouter");

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("uploads"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/users", usersRouter);
app.use("/pizzerias", pizzeriaRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;

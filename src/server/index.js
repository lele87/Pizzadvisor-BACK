const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("../routers/userRouter");
const { notFoundError, generalError } = require("./middlewares/errors");
const corsOptions = require("../utils/corsOptions");
const pizzeriaRouter = require("../routers/pizzeriaRouter");
const auth = require("./middlewares/auth");

const app = express();

app.disable("x-powered-by");
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.static("uploads"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/pizzerias", auth, pizzeriaRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;

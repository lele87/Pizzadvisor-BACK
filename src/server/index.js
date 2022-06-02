const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const userRouter = require("../routers/userRouter");
const { notFoundError, generalError } = require("./middlewares/errors");
const corsOptions = require("../utils/corsOptions");
const pizzeriaRouter = require("../routers/pizzeriaRouter");

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/user", userRouter);
app.use("/pizzerias", pizzeriaRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;

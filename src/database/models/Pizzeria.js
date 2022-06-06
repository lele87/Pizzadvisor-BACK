const { Schema, model } = require("mongoose");

const PizzeriaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  timetable: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  specialty: {
    type: String,
  },
});

const Pizzeria = model("Pizzeria", PizzeriaSchema, "pizzerias");
module.exports = Pizzeria;

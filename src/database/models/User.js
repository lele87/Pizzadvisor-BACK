const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favourites: {
    pizzerias: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pizzeria",
        default: [],
      },
    ],
  },
});
const User = model("User", UserSchema, "users");
module.exports = User;

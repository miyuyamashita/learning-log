const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: String,
  logs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Log",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);

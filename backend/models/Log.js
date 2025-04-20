const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Log", logSchema);

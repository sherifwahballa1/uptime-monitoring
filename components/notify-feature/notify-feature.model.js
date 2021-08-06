const mongoose = require("mongoose");

const Feature = new mongoose.Schema(
  {
    type: { type: String, default: "" },
    name: { type: String, required: true, unique: true },
    providers: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", Feature);

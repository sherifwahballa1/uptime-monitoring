const mongoose = require("mongoose");

const Feature = new mongoose.Schema(
  {
    type: { type: String, default: "" },
    name: { type: String, required: true, unique: true },
    providers: [String], // keys need for the service ex: pushover need (userKey) ['userKey']
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", Feature);

const express = require("express");
const Security = require("../../security");
const router = express.Router({ caseSensitive: false });

const {
  signup
} = require("./controllers");

router.post("/signup.json", signup);

module.exports = router;

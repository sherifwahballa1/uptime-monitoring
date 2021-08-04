const express = require("express");
const Security = require("../../security");

const router = express.Router({ caseSensitive: false });

const {
  signup,
  sendVerification
} = require("./controllers");

router.post("/signup.json", signup);

router.post(
  "/verification-code.json",
  Security.validateTempToken,
  sendVerification
);

module.exports = router;

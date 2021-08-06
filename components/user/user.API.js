const express = require("express");
const Security = require("../../security");
const router = express.Router({ caseSensitive: false });

const {
  signup,
  sendVerification,
  verify,
  login,
  logout
} = require("./controllers");

router.post("/signup.json", signup);
router.post("/login.json", login);

router.post(
  "/verification-code.json",
  Security.validateTempToken,
  sendVerification
);
router.post("/verify.json", Security.validateTempToken, verify);


router.post("/logout", logout);

module.exports = router;

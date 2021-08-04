const signup = require("./signup");
const sendVerification = require("./send-otp");
const verify = require("./verify");
const login = require("./login");
const logout = require("./logout");

module.exports = {
  signup,
  sendVerification,
  verify,
  login,
  logout,
};

const User = require("./routes/user");
const Check = require("./routes/check");
const Report = require("./routes/report");
const Feature = require("./routes/feature");

module.exports = {
  "/api/user/signup.json": User.signup,
  "/api/user/verification-code.json": User.sendOtp,
  "/api/user/verify.json": User.verifyOTP,
  "/api/user/login.json": User.login,
  "/api/user/logout": User.logout,

  "/api/check": Check.create,
  "/api/check/{id}": Check.update,
  "/api/check/": Check.getAllChecks,
  "/api/check/tag/{tagName}": Check.getChecksByTag,
  "/api/check/name/{checkName}": Check.getCheckByName,
  "/api/check/{checkId}": Check.getCheckById,
  "/api/check/pause/{id}": Check.toggleCheck,
  "/api/check/all": Check.removeAllChecks,
  "/api/check/tag/${tagName}": Check.removeChecksByTagName,
  "/api/check/${id}": Check.removeCheckById,

  "/api/report/{id}": Report.getReportByCheckId,
  "/api/report/name/{checkName}": Report.getReportByCheckName,
  "/api/report/tag/{tagName}": Report.getReportByCheckTagName,

  "/api/notify/feature": Feature.create,
};

const Check = require("../../components/check/check.model");
const Report = require("../../components/report/report.model");
const Email = require("../../modules/email");
const axios = require("axios");
const Monitor = require("./../../monitor");
async function allChecks() {
  let monitors = [];
  let checks = await Check.find({}).populate({
    path: "userId",
    select: "name email notifications",
  });

  checks.forEach(async (check) => {
    if (check.isActive === true) {
      let monitor = new Monitor(check, axios, Email, Check, Report);
      monitors.push(monitor);
    }
  });

  // monitors.forEach((element) => {
  //   element.stop();
  // });
}

module.exports = function () {
  allChecks();
};

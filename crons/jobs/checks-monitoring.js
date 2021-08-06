const Config = require("../../config");
const Monitor = require("../../monitor");
const Check = require("../../components/check/check.model");
const Report = require("../../components/report/report.model");
const Email = require("../../modules/email");
const axios = require("axios");
const { pushNotificationService } = require("./../../notifications system");
let monitors = [];
let lastChecks = [];
let new_checks = [];

module.exports = function (CronJob) {
  let job = new CronJob({
    //runs every x minutes
    cronTime: `0 */${Config.cronTime} * * * *`,
    onTick: async function () {
      let checks = await Check.find({}).populate({
        path: "userId",
        select: "name email notifications",
      });

      // TODO: Fix error
      // if monitors > checks || monitors < checks
      if (monitors.length != checks.length) {
        if (checks.length !== lastChecks.length) {
          new_checks = checks.slice(lastChecks.length, checks.length);
          new_checks.forEach((check) => {
            if (check.isActive === true) {
              let monitor = new Monitor(
                check,
                axios,
                Email,
                Check,
                Report,
                pushNotificationService
              );
              monitors.push(monitor);
              lastChecks.push(check);
            }
          });
        }
      }
    },
    start: false,
    timeZone: Config.timeZone,
  });
  job.start();
};

const Config = require("../../config");
const Monitor = require("../../monitor");
const Check = require("../../components/check/check.model");
const Report = require("../../components/report/report.model");
const Email = require("../../modules/email");
const axios = require("axios");
const { pushNotificationService } = require("./../../notifications system");
const e = require("express");
let monitors = [];
let lastChecks = [];
// let new_checks = [];

function initNewCheck(check) {
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
}

module.exports = function (CronJob) {
  let job = new CronJob({
    //runs every x minutes
    cronTime: `0 */${Config.cronTime} * * * *`,
    onTick: async function () {
      let checks = await Check.find({}).populate({
        path: "userId",
        select: "name email notifications",
      });

      if (checks.length > 0 && monitors.length != checks.length) {
        // can use redis here to cache current checks(monitors)
        // first time
        if (checks.length > monitors.length && monitors.length === 0) {
          console.log("First");
          // new_checks = checks.slice(lastChecks.length, checks.length);
          checks.forEach((check) => {
            initNewCheck(check);
          });

          // if new checks added
        } else if (checks.length > monitors.length && monitors.length !== 0) {
          let new_checks = checks.slice(monitors.length, checks.length);
          new_checks.forEach((check) => {
            initNewCheck(check);
          });
          // return the new checks after remove one or more
        } else if (checks.length < monitors.length) {
          let expiredChecks = lastChecks.filter((el) =>
            checks.every((check2) => check2._id.toString() != el._id.toString())
          );

          expiredChecks.forEach((check) => {
            let findMonitor = monitors.find(
              (el) => el.check._id.toString() === check._id.toString()
            );
            findMonitor.stop();
            monitors = monitors.filter((monitor) => {
              return monitor.check._id.toString() !== check._id.toString();
            });
            lastChecks = lastChecks.filter((ex_check) => {
              return check._id.toString() !== ex_check._id.toString();
            });
          });
        }
      }
    },
    start: false,
    timeZone: Config.timeZone,
  });
  job.start();
};

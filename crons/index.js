const CronJob = require("cron").CronJob;
const monitor = require("./jobs/checks-monitoring");

module.exports = function () {
  monitor(CronJob);
};

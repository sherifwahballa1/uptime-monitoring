class Monitor {
  constructor(
    check,
    axios,
    Email,
    CheckModule,
    ReportModule,
    pushNotificationService
  ) {
    this.axios = axios;

    this.Email = Email;

    this.CheckModule = CheckModule;

    this.ReportModule = ReportModule;

    // holds website to be monitored
    this.website = "";

    // ping intervals in minutes
    this.inteval = check.interval * (60 * 1000);

    if (check.webhook) this.webhook = check.webhook;

    // The threshold of failed requests that will create an alert
    this.threshold = check.threshold;

    this.check = check;

    this.pushNotificationService = pushNotificationService;

    // interval handler
    this.handle = null;

    // initialize the app
    this.init(check);

    return this;
  }
}

Monitor.prototype.init = function (check) {
  const self = this;

  self.website = self.parseUrl(check);

  self.interval = check.interval * (60 * 1000);

  //   start monitoring
  self.start();
};

Monitor.prototype.parseUrl = function (check) {
  let self = this;
  let url = `${self.check.protocol.toLowerCase()}://${self.check.url}`;
  if (self.check.port) url += `:${self.check.port}`;
  if (self.check.path) url += `/${self.check.path}`;

  return url;
};

Monitor.prototype.start = function () {
  let self = this;
  // create an interval for checks
  self.handle = setInterval(function () {
    self.ping();
  }, self.inteval);
};

Monitor.prototype.ping = async function () {
  let self = this;
  let beforeHitTime = Date.now();
  let afterHitTime;
  let serverRun;
  try {
    let config = self.configRequest();

    const hitResponse = await self.axios(self.parseUrl(), config);
    afterHitTime = Date.now();
    serverRun = hitResponse.status >= 200 && hitResponse.status < 300;

    await self.generateReport(serverRun, beforeHitTime, afterHitTime);
  } catch (err) {
    self.generateReport(serverRun, 0, 0);
  }
};

Monitor.prototype.configRequest = function () {
  let self = this;
  const config = {
    method: self.check.method,
    protocol: self.check.protocol.toLowerCase() + ":",
    timeout: 1000 * self.check.timeout,
  };
  if (self.check.authentication) config.auth = self.check.authentication;
  if (self.check.headers) config.headers = self.check.headers;

  return config;
};

Monitor.prototype.generateReport = async function (
  serverRun,
  beforeHitTime,
  afterHitTime
) {
  let self = this;

  let report = await self.ReportModule.findOne({ checkId: self.check._id });

  console.log(self.check.url);

  if (!report) {
    report = new self.ReportModule({
      checkId: self.check._id,
    });
  }

  // if down and goes up
  if (report.status === "down" && serverRun) {
    console.log("Down and goes up");
    let message = `Server: check(${self.check.name}) URL ${self.check.url} is Running status up`;

    report.lastOutages = 1;
    // push notifcations
    self.pushNotification(message);
  }

  // if up and goes down
  if (report.status === "up" && !serverRun) {
    if (report.lastOutages == self.check.threshold) {
      let message = `Server: check(${self.check.name}) URL ${self.check.url} is Down status down`;
      // push notifcations
      self.pushNotification(message);

      report.lastOutages = 1;
    }
  }

  if (
    report.status === "down" &&
    !serverRun &&
    report.lastOutages <= self.check.threshold
  ) {
    report.lastOutages = report.lastOutages + 1;
    if (report.lastOutages === self.check.threshold) {
      let message = `Server: check(${self.check.name}) URL ${self.check.url} is Down status down`;
      // push notifcations
      self.pushNotification(message);
      report.lastOutages = 1;
    }
  }

  report.status = serverRun ? "up" : "down";

  report.availability = serverRun
    ? Math.min(
        ((report.uptime + self.check.interval * 60) /
          (report.uptime + report.downtime)) *
          100,
        100
      )
    : Math.min(
        ((report.downtime + self.check.interval * 60) /
          (report.uptime + report.downtime)) *
          100,
        100
      );

  report.outages = serverRun ? report.outages : report.outages + 1;

  report.downtime = serverRun
    ? report.downtime
    : report.downtime + self.check.interval * 60;

  report.uptime = serverRun
    ? report.uptime + self.check.interval * 60
    : report.uptime;

  report.responseTime = afterHitTime - beforeHitTime;

  await report.save();
};

Monitor.prototype.pushNotification = async function (message) {
  let self = this;
  await new self.Email({ user: self.check.userId, message }).monitoringMail();

  if (self.check.webhook) await self.webHookNotify();
  if (
    self.check.userId.notifications &&
    self.check.userId.notifications.length > 0
  ) {
    self.pushNotificationService(self.check.userId, message);
  }
};

Monitor.prototype.webHookNotify = async function () {
  let self = this;
  const config = {
    method: "POST",
    url: self.check.webhook,
  };

  await self.axios(self.check.webhook, config);
  return;
};

Monitor.prototype.stop = function () {
  clearInterval(this.handle);
  this.handle = null;
};

module.exports = Monitor;

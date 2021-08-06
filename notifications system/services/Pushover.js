const { Notification } = require("./Notification");
const Config = require("./../../config");
const Pushover = require("node-pushover");

class PushOver extends Notification {
  constructor(userInfo, notifyInfo, message) {
    super();
    this.userInfo = userInfo;
    this.notifyInfo = notifyInfo;
    this.message = message;
  }

  pushNotification() {
    let push = new Pushover({
      token: Config.appPushOverToken,
      user: this.notifyInfo["userKey"],
    });

    push.send(
      `Welcome ${this.userInfo.name}`,
      `${this.message}`,
      function (err, res) {
        if (err) return console.log(err);
        console.log("Done");
      }
    );
  }
}

module.exports = {
  PushOver,
};

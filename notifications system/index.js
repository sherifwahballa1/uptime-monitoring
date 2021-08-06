// import { PushOver } from './services/Pushover';
// import { Sendgrid } from './services/Sendgrid';

const { PushOver } = require("./services/Pushover");

const pushNotificationService = function (userInfo, message) {
  for (let index = 0; index < userInfo.notifications.length; index++) {
    let notifyObj = mapToObj(userInfo.notifications[index]);
    switch (notifyObj.type) {
      case "pushover":
        let push = new PushOver(userInfo, notifyObj, message);
        push.pushNotification();
        break;

      default:
        break;
    }
  }
  // userInfo.notifications.forEach((key, value) => {
  //   console.log(key, value, "aaaa");
  // console.log(lp["type"], "aaaa");
};

function mapToObj(inputMap) {
  let obj = {};

  inputMap.forEach(function (value, key) {
    obj[key] = value;
  });

  return obj;
}
module.exports = {
  pushNotificationService,
};

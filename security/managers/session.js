const Config = require("../../config");
const Session = require("../../utils/session-model/session");
const timeFactory = require("../../modules/time-factory.js");

function generateLoginDetails() {
  return {
    exp: timeFactory.to(
      "seconds",
      timeFactory.cal("add", Config.tokenValidationInDays, "day", new Date())
    ),
    iat: timeFactory.to("seconds", new Date())
  };
}

// check if login expired
function isLoginExpired(s) {
  const now = timeFactory.to("seconds", new Date());
  return s.exp < now;
}

module.exports = {
  // accepts user id and pass newly created session to the callback
  async login(user) {
    let newLogin;
    let record = await Session.findOne({ user: user._id });
    if (!record) {
      record = new Session();
      record.createFor(user);
    }
    newLogin = record.newLogin(generateLoginDetails());
    await record.save();
    return newLogin;
  },

  // works on the level of validation
  validateURN(req, cb) {
    Session.findOne({ user: req.userData._id }).exec(function (err, record) {
      if (record) {
        // user session usage is not blocked
        if (record.usage.blocked && record.usage.nextAt > new Date()) {
          return cb({
            error:
              "user is blocked for session abuse and not ready for next usage",
            userMsg: "user is blocked for session abuse",
            valid: false,
            record,
          });
        }
        if (record.usage.blocked && record.usage.nextAt < new Date()) {
          record.resetUsage();
        }
        // session number exists
        const currentSession = record.getLogin(req.userData.urn);
        if (!currentSession)
          return cb({
            error: "login session number not found",
            userMsg: "login session expired session not exists",
            valid: false,
            record,
          });

        // session date is not expired
        if (isLoginExpired(currentSession))
          return cb({
            error: "login session expired",
            userMsg: "login session expired",
            valid: false,
            record,
          });

        return cb({ error: null, valid: true, record });
      } else {
        return cb({
          error: "session record not found",
          userMsg: "login session expired not found",
          valid: false,
          record,
        });
      }
    });
  },

};

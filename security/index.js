const sessionManager = require("./managers/session");
const roleManager = require("./managers/role");
const tokenManager = require("./managers/token");
const Config = require("../config");

module.exports = {
  masking(app) {
    app.use(function (req, res, next) {
      res.setHeader("X-Powered-By", "PHP/5.1.2");
      next();
    });
  },

  async buildToken(user) {
    let userSessionData = await sessionManager.login(user);
    userSessionData = {
      ...userSessionData,
      _id: user._id,
      role: user.role,
      u_id: user.userID,
    };
    return tokenManager.sign(userSessionData);
  },

  signTempJWT(user) {
    return tokenManager.signTemp(user);
  },

  auth(allowedRoles) {
    return async function (req, res, next) {
      try {
        if (!req.headers.authorization)
          req.userData = tokenManager.verify(req.signedCookies.auth_token);
        else req.userData = tokenManager.verify(req.headers.authorization);

        if (!roleManager.isRoleAllowed(req, allowedRoles))
          return res
            .status(401)
            .json({ message: "Not Authorized User not allowed to access" });

        sessionManager.validateURN(req, function (opts) {
          if (!opts.valid)
            return res.status(401).json({ message: opts.userMsg });
          next();
        });
      } catch (error) {
        return res.status(401).json({ message: "Not authorized user" });
      }
    };
  },

  validateTempToken(req, res, next) {
    try {
      if (!req.headers.authorization)
        return res.status(401).json({ message: "Not authorized user" });

      const tokenDecodedData = tokenManager.verifyTemp(
        req.headers.authorization
      );
      req.userData = tokenDecodedData;
      next();
    } catch (error) {
      return res.status(401).json({ message: "OTP validation time expired" });
    }
  },

  setCookies(req, res, token) {
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: +Config.tokenValidationInDays * 24 * 60 * 60 * 1000,
      secure: Config.currentEnv == "development" ? false : true,
      signed: true,
      sameSite: true,
    });
  },
};

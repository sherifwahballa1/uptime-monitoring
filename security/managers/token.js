const jwt = require("jsonwebtoken");

const config = require("../../config");

// check if token exists
function isExists(req) {
  if (req.headers.authorization && req.headers.authorization !== undefined) {
    return true;
  }
  return false;
}

// sign token
function signToken(data) {
  return jwt.sign(data, config.PRIVATEKEY, {
    algorithm: "RS256",
  });
}


// return decodedString/false
function verifyToken(token) {
  return jwt.verify(token, config.PUBLICKEY, {
    algorithm: "RS256",
  });
}

function signTemp(user) {
  return jwt.sign(
    { _id: user._id, email: user.email },
    config.tempTokenSecret,
    {
      algorithm: "HS256",
      expiresIn: `${config.tempTokenDurationInHours}h`,
    }
  );
}

function verifyTemp(token) {
  return jwt.verify(token, config.tempTokenSecret);
}

module.exports = {
  isExists,
  sign: signToken,
  verify: verifyToken,
  signTemp,
  verifyTemp
};

module.exports = {
  dbURI: process.env.MONGO_URI + process.env.MONGO_REWRITE,
  ORIGIN_CORS: process.env.ORIGIN_CORS.split(","),
  tokenValidationInDays: process.env.tokenValidationInDays,
  SESSION_SECRET: process.env.SESSION_SECRET,
  TempToken: process.env.TEMP_TOKEN_SECRET,
  tempTokenDurationInHours: process.env.tempTokenDurationInHours,
  timeZone: process.env.timeZone,
  cronTime: process.env.cronTime,
  appPushOverToken: process.env.appPushOverToken,
  HOST: process.env.HOST,
  email: {
    user: process.env.User_Email,
    pass: process.env.User_Password,
  },
};

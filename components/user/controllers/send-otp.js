const createError = require("http-errors");
const mongoose = require("mongoose");

const User = require("../user.model");
const Email = require("../../../modules/email");
const catchAsync = require("../../../utils/catchAsync");

sendVerification = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.userData._id))
    return res.status(400).json({ message: "Invalid User Id" });

  const user = await User.findOne().byID(req.userData._id);
  if (!user) return next(createError(401, "user not authorized"));

  let timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
  const responseBody = {
    timeInSeconds,
    email: user.email,
    message: "To update email or resend verification please try again later",
  };

  // if otp next resend time didn't expire
  let otpNextDate = new Date(user.otpNextResendAt);
  let milliseconds = otpNextDate.getTime();

  if (milliseconds > Date.now()) {
    let timeNextOpt = Math.trunc(
      (new Date(user.otpNextResendAt) - Date.now()) / (1000 * 60)
    );
    responseBody.message = `Try again later after ${timeNextOpt + 1} minute(s)`;
    // logger.error(`To update email or resend verification please try again later, ${responseBody.timeInSeconds}, ${responseBody.email}`, 400, 'send verification');
    return res.status(400).json(responseBody);
  }

  user.updateOtp();
  await user.save();

  await new Email({ user, code: user.otp }).sendWelcome();
  timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
  responseBody.message = "Please Check your Email";

  responseBody.timeInSeconds = timeInSeconds;
  return res.status(200).send(responseBody);
});

module.exports = sendVerification;

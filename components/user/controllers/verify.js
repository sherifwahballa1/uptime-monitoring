const createError = require("http-errors");
const catchAsync = require("../../../utils/catchAsync");
const User = require("../user.model");
const { otp: otpSchema } = require("../user.validation");
const securityModule = require("../../../security");
const Config = require("../../../config");

verify = catchAsync(async (req, res, next) => {
  // validate all data felids
  const { error, value } = otpSchema.validate(req.body);
  // there are error in the validation data not valid
  if (error)
    return res
      .status(400)
      .json({ message: error.message.replace(/"/g, ""), status: 400 });

  const user = await User.findOne(
    { _id: req.userData._id },
    "-__v -createdAt -updatedAt"
  );
  if (!user) return next(createError(401, "User is not found"));

  // if otp next resend time didn't expire
  let otpNextDate = new Date(user.otpNextResendAt);
  let milliseconds = otpNextDate.getTime();

  if (milliseconds > Date.now()) {
    let timeNextOpt = Math.trunc(
      (new Date(user.otpNextResendAt) - Date.now()) / (1000 * 60)
    );
    let message = `Number of your tries is finished try again later after ${timeNextOpt + 1} minute(s)`;
    // logger.error(`To update email or resend verification please try again later, ${responseBody.timeInSeconds}, ${responseBody.email}`, 400, 'send verification');
    return res.status(400).json({ message });
  }

  if (user.otp !== value.otp) {
    user.updateSubmitOtp();
    await user.save();
    return next(createError(400, "Invalid code"));
  }
  user.isVerified = true;
  user.otpRequestCounter = 0;
  user.otpSubmitCounter = 0;
  await user.save();



  user.isVerified = true;
  user.otpRequestCounter = 0;
  await user.save();

  // remove data from user
  user.otpRequestCounter =
    user.password =
    user.otp =
    user.updatedAt =
    undefined;

  let token = await securityModule.buildToken(user);
  req.session.user_sid = { userId: req.userData._id, role: user.role };
  req.session.save();

  await securityModule.setCookies(req, res, token);

  return res.status(200).json({
    token,
    verified: true,
  });
});

module.exports = verify;

const createError = require("http-errors");

const User = require("../user.model");
const { login: loginSchema } = require("../user.validation");
const securityModule = require("../../../security");
const catchAsync = require("../../../utils/catchAsync");

login = catchAsync(async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ message: error.message.replace(/"/g, ""), status: 400 });

  const user = await User.findOne()
    .byEmail(value.email)
    .select("email password isVerified role _id");

  if (!user) return next(createError(401, "Invalid email or password"));
  const isPasswordValid = await user.isPasswordValid(value.password);
  if (!isPasswordValid)
    return next(createError(401, "Invalid email or password"));

  if (!user.isVerified)
    return res.status(201).json({
      temp: user.signTempJWT(),
      verified: false,
      message: "Email  not verified please check email address",
    });

  let token = await securityModule.buildToken(user);
  
  req.session.user_sid = { userId: user._id, role: user.role };
  req.session.save();

  await securityModule.setCookies(req, res, token);

  return res.status(200).json({
    token,
    verified: true,
  });
});

module.exports = login;

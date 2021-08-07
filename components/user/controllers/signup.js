const User = require("../user.model");
const Feature = require("./../../notify-feature/notify-feature.model");
const catchAsync = require("../../../utils/catchAsync");
const { signup: signupSchema } = require("../user.validation");
const securityModule = require("./../../../security");

signup = catchAsync(async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message.replace(/"/g, "") });

    let user = await User.findOne({ email: value.email });

    if (user && user.email === value.email)
      return res
        .status(409)
        .json({ message: "Email already registered before", status: 409 });

    if (value.phone) {
      if (user && user.phone == value.phone)
        return res
          .status(409)
          .json({ message: "Phone number is used", status: 409 });
    }

    let features = await Feature.find({});
    if (features.length <= 0 && value.notifications) {
      return res.status(400).json({
        message: `Notification not allowed`,
        status: 400,
      });
    } else if (value.notifications) {
      let features_names = [];
      features.forEach((element) => {
        features_names.push(element["name"]);
      });
      for (let index = 0; index < value.notifications.length; index++) {
        if (!value.notifications[index].type) {
          return res.status(400).json({
            message: `Notification (type) required and must be one of ${features_names}`,
            status: 400,
          });
        } else if (
          value.notifications[index].type &&
          !features_names.includes(value.notifications[index].type)
        ) {
          return res.status(400).json({
            message: `Notification (type) must be one of ${features_names}`,
            status: 400,
          });
        } else if (
          value.notifications[index].type &&
          features_names.includes(value.notifications[index].type)
        ) {
          let f = features.filter((feature) => {
            return feature.name === value.notifications[index].type;
          });

          let props = f[0].providers;

          for (let i = 0; i < props.length; i++) {
            if (!value.notifications[index].hasOwnProperty(props[i])) {
              return res.status(400).json({
                message: `${props[i]} required`,
                status: 400,
              });
            }
          }
        }
      }
    }

    user = await User.create(value);
    const token = securityModule.signTempJWT(user);
    return res.status(200).send({ temp: token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = signup;

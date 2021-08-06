// const mongoose = require("mongoose");
const Notification = require("../notify-feature.model");
const catchAsync = require("../../../utils/catchAsync");
// const { checkInfo: checkSchema } = require("../check.validation");

createNewNotificationFeature = async (req, res) => {
  try {
    let newCheck = await Notification.create(req.body);

    return res.status(200).send(newCheck);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = createNewNotificationFeature;

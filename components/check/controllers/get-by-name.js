const mongoose = require("mongoose");
const Check = require("../check.model");
const createError = require("http-errors");
const catchAsync = require("../../../utils/catchAsync");
const { checkName: checkNameSchema } = require("../check.validation");

checkByName = catchAsync(async (req, res, next) => {
  let { error, value } = checkNameSchema.validate(req.params, {
    stripUnknown: true,
  });
  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, "") });

  const check = await Check.findOne({
    userId: mongoose.Types.ObjectId(req.userData._id),
    name: value.checkName,
  }).select("-__v -updatedAt");

  if (!check) return next(createError(404, "Check not found"));

  res.status(200).send(check);
});

module.exports = checkByName;

const mongoose = require("mongoose");
const Check = require("../check.model");
const createError = require("http-errors");
const catchAsync = require("../../../utils/catchAsync");

checkById = catchAsync(async (req, res, next) => {
  let checkID = req.params.checkId;
  if (!mongoose.Types.ObjectId.isValid(checkID))
    return res.status(404).json({ message: "Invalid check" });

  const check = await Check.findOne({
    userId: mongoose.Types.ObjectId(req.userData._id),
    _id: checkID,
  }).select("-__v -updatedAt");

  if (!check) return next(createError(404, "Check not found"));

  res.status(200).send(check);
});

module.exports = checkById;

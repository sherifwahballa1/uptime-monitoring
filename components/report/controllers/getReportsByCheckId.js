const mongoose = require("mongoose");
const Report = require("../report.model");
const Check = require("../../check/check.model");
const createError = require("http-errors");
const catchAsync = require("../../../utils/catchAsync");

ReportsByCheckID = catchAsync(async (req, res, next) => {
  let checkID = req.params.id;
  console.log(req.params);
  if (!mongoose.Types.ObjectId.isValid(checkID))
    return res.status(404).json({ message: "Invalid check" });

  const check = await Check.findOne({
    _id: checkID,
    userId: mongoose.Types.ObjectId(req.userData._id),
  }).populate("checkId");

  if (!check) return next(createError(404, "Check not found"));

  const reports = await Report.find({ checkId: checkID });

  if (reports.length <= 0)
    return res.status(404).json({ message: "no reports founded" });

  return res.status(200).send(reports);
});

module.exports = ReportsByCheckID;

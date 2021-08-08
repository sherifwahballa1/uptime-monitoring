const mongoose = require("mongoose");
const Report = require("../report.model");
const Check = require("../../check/check.model");
const createError = require("http-errors");
const catchAsync = require("../../../utils/catchAsync");

ReportsByCheckName = catchAsync(async (req, res, next) => {
  let checkName = req.params.checkName;

  const check = await Check.findOne({
    name: checkName,
    userId: mongoose.Types.ObjectId(req.userData._id),
  });

  if (!check) return next(createError(404, "Check not found"));

  const reports = await Report.find({
    checkId: mongoose.Types.ObjectId(check._id),
  }).populate("checkId");

  if (reports.length <= 0)
    return res.status(404).json({ message: "no reports founded" });

  return res.status(200).send(reports);
});

module.exports = ReportsByCheckName;

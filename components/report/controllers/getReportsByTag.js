const Check = require("../../check/check.model");
const Report = require("../report.model");
const catchAsync = require("../../../utils/catchAsync");

reportsByTag = catchAsync(async (req, res, next) => {
  const checks = await Check.find({
    userId: req.userData._id,
    tags: { $in: req.params.tagName },
  }).select("_id");

  if (checks.length <= 0)
    return res.status(404).json({ message: "no checks exists" });

  let checksIds = [];
  checks.forEach((check) => {
    checksIds.push(check._id);
  });

  const reports = await Report.find({
    checkId: { $in: checksIds },
  });

  return res.status(200).send(reports);
});

module.exports = reportsByTag;

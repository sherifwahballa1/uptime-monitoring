const Check = require("../check.model");
const catchAsync = require("../../../utils/catchAsync");
const { pagination: paginationSchema } = require("../check.validation");

allChecks = catchAsync(async (req, res, next) => {
  let { error, value } = paginationSchema.validate(req.query, {
    stripUnknown: true,
  });
  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, "") });

  if (!value.limitNo) value.limitNo = 50;
  if (!value.pageNo) value.pageNo = 0;

  const queryLimitNo = Number.parseInt(value.limitNo);
  const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

  const checks = await Check.find({ userId: req.userData._id })
    .select("-__v -updatedAt")
    .skip(querySkipNo)
    .limit(queryLimitNo);

  if (checks.length <= 0)
    return res.status(200).json({ message: "no checks", checks: [] });

  res.status(200).send(checks);
});

module.exports = allChecks;

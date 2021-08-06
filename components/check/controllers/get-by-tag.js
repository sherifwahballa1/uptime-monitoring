const Check = require("../check.model");
const catchAsync = require("../../../utils/catchAsync");

checksByTag = catchAsync(async (req, res, next) => {

    const checks = await Check.find({ userId: req.userData._id, tags: { $in: req.params.tagName } }).select("-__v -updatedAt");

    if (checks.length <= 0)
        return res
            .status(204)
            .json({ message: "no checks" });

    res.status(200).send(checks);
});

module.exports = checksByTag;

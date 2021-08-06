const mongoose = require('mongoose');
const Check = require("../check.model");
const createError = require("http-errors");
const catchAsync = require("../../../utils/catchAsync");

allChecks = catchAsync(async (req, res, next) => {

    const checks = await Check.find({ userId: req.userData._id }).select("-__v -updatedAt");

    if (checks.length <= 0)
        return res
            .status(204)
            .json({ message: "no checks" });

    // get all checks reports

    res.status(200).send(checks);
});

module.exports = allChecks;

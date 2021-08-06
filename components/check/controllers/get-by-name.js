const mongoose = require('mongoose');
const Check = require("../check.model");
const createError = require("http-errors");
const catchAsync = require("../../../utils/catchAsync");

checkByName = catchAsync(async (req, res, next) => {
    let checkName = req.params.checkName;
    if (!mongoose.Types.ObjectId.isValid(checkID))
        return res.status(404).json({ message: 'Invalid check' });

    const check = await Check.findOne({ _id: checkID, name: checkName }).select("-__v -updatedAt")
        .orFail((err) => {
            return next(createError(404, "Check not found"));
        });

    // get reports

    res.status(200).send(check);
});

module.exports = checkByName;

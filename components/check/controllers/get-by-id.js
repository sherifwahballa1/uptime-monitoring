const mongoose = require('mongoose');
const Check = require("../check.model");
const createError = require("http-errors");
const catchAsync = require("../../../utils/catchAsync");

checkById = catchAsync(async (req, res, next) => {
    let checkID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(checkID))
        return res.status(404).json({ message: 'Invalid check' });

    const check = await Check.findOne({ _id: checkID, userId: req.userData._id }).select("-__v -updatedAt")
        .orFail((err) => {
            return next(createError(404, "Check not found"));
        });

    res.status(200).send(check);
});

module.exports = checkById;

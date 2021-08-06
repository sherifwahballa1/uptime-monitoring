const mongoose = require('mongoose');
const Check = require("../check.model");
const createError = require("http-errors");
const { checkUpdate: checkValidation } = require("../check.validation");
const catchAsync = require("../../../utils/catchAsync");

editCheck = catchAsync(async (req, res, next) => {
    let checkID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(checkID))
        return res.status(404).json({ message: 'Invalid check' });

    const { error, value } = checkValidation.validate(req.body);
    if (error)
        return next(createError(400, `${error.message.replace(/"/g, "")}`));

    const check = await Check.findOne({ _id: checkID, userId: req.userData._id })
        .select("_id name url")
        .orFail((err) => {
            return next(createError(404, "Check not found"));
        });

    if (value && Object.keys(value).length === 0) return next(createError(400, "There's no exists something to update"));

    if (value.name) {
        let checks = await Check.find({ name: value.name, userId: { $ne: mongoose.Types.ObjectId(req.userData._id) } });
        if (checks.length > 0) return res.status(429).json({ messgae: 'Name used before'});
    }

    const updatedCheck = await Check.findByIdAndUpdate({ _id: checkID, userId: req.userData._id }, value, {
        new: true,
    })

    res.status(200).json({
        message: "check updated successfully",
        check: updatedCheck,
    });
});

module.exports = editCheck;

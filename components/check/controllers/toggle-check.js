const mongoose = require("mongoose");
const Check = require("../check.model");
const createError = require("http-errors");

toggleCheck = async (req, res, next) => {
  try {
    let checkID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(checkID))
      return res.status(400).json({ message: "Invalid check" });

    let userId = mongoose.Types.ObjectId(req.userData._id);

    const check = await Check.findOne({ _id: checkID, userId }).select(
      "_id name url isActive"
    );

    if (!check) return next(createError(404, "Check not found"));

    let paused = check.isActive;

    await Check.findOneAndUpdate(
      {
        _id: checkID,
        userId,
      },
      { isActive: !paused }
    );

    if (paused != false)
      return res.status(200).json({ message: "Check is paused" });

    return res.status(200).json({ message: "Check is Active now" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = toggleCheck;

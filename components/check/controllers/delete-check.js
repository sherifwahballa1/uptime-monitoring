const mongoose = require("mongoose");
const createError = require("http-errors");
const Check = require("../check.model");
const Report = require("./../../report/report.model");

deleteCheck = async (req, res, next) => {
  try {
    let checkID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(checkID))
      return res.status(400).json({ message: "Invalid check" });

    let userId = mongoose.Types.ObjectId(req.userData._id);

    let check = await Check.findOne({ _id: checkID, userId }).select(
      "_id name url isActive"
    );
    if (!check) {
      return next(createError(404, "Check not found"));
    }

    await Check.findByIdAndRemove(checkID);
    await Report.deleteMany({ checkId: checkID });

    return res.status(200).json({ message: "Check deleted successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = deleteCheck;

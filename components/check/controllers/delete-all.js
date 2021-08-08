const mongoose = require("mongoose");
const Check = require("../check.model");
const Report = require("./../../report/report.model");

deleteAllCheck = async (req, res, next) => {
  try {
    let userId = mongoose.Types.ObjectId(req.userData._id);

    let allChecks = await Check.find({ userId }).select(
      "_id name url isActive"
    );

    if (allChecks.length <= 0)
      return res.status(200).json({ message: "no checks to remove" });

    for (let i = 0; i < allChecks.length; i++) {
      await Report.deleteMany({ checkId: allChecks[i]._id });
    }

    await Check.deleteMany({ userId });

    // remove all reports
    return res
      .status(200)
      .json({ message: "All checks deleted successfully !" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = deleteAllCheck;

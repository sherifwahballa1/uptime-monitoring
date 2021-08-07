const mongoose = require("mongoose");
const Check = require("../check.model");
const Report = require("./../../report/report.model");

deleteByTagName = async (req, res, next) => {
  try {
    let userId = mongoose.Types.ObjectId(req.userData._id);
    let tagName = req.params.tagName;

    let allChecks = await Check.find({ userId, tags: { $in: tagName } }).select(
      "_id name url isActive"
    );

    if (allChecks.length <= 0)
      return res.status(404).json({ message: "no checks founded" });

    for (let i = 0; i < allChecks.length; i++) {
      await Report.deleteMany({ checkId: allChecks[i]._id });
    }

    await Check.deleteMany({ userId });
    // remove all reports
    return res
      .status(200)
      .json({
        message: `All checks with tag ${tagName} deleted successfully !`,
      });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = deleteByTagName;

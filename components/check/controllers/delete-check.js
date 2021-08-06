const mongoose = require('mongoose');
const createError = require("http-errors")
const Check = require("../check.model");

deleteCheck = async (req, res, next) => {
    try {
        let checkID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(checkID))
            return res.status(404).json({ message: 'Invalid check' });

        let userId = mongoose.Types.ObjectId(req.userData._id);
        
        await Check.findOne({ _id: checkID, userId })
            .select("_id name url isActive")
            .orFail((err) => {
                return next(createError(404, "Check not found"));
            });

        await Check.findByIdAndRemove(checkID);

        return res
            .status(200)
            .json({ message: "Check deleted successfully" });

    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = deleteCheck;

const mongoose = require('mongoose');
const Check = require("../check.model");

deleteAllCheck = async (req, res, next) => {
    try {
        let userId = mongoose.Types.ObjectId(req.userData._id);

        let allChecks = await Check.find({ userId })
            .select("_id name url isActive");

        if (allChecks.length <= 0)
            return res
                .status(204)
                .json({ message: "no checks to remove" });
        
        await Check.deleteMany({ userId });

        
        return res
            .status(200)
            .json({ message: "All checks deleted successfully !" });

    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = deleteAllCheck;
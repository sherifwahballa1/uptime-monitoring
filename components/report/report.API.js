const express = require("express");
const { auth } = require("../../security");
const router = express.Router({ caseSensitive: false });

const {
    ReportsByCheckID,
    reportsByTag,
    ReportsByCheckName
} = require("./controllers");


router.get("/:id", auth(['user']), ReportsByCheckID);

router.get("/name/:checkName", auth(['user']), ReportsByCheckName);

router.get("/tag/:tagName", auth(['user']), reportsByTag);



module.exports = router;

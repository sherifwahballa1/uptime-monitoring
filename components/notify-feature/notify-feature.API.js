const express = require("express");
const { auth } = require("../../security");
const router = express.Router({ caseSensitive: false });

const { createNewNotificationFeature } = require("./controllers");

router.post("/", auth(["admin"]), createNewNotificationFeature);

module.exports = router;

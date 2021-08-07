const express = require("express");
const { auth } = require("../../security");
const router = express.Router({ caseSensitive: false });

const {
  createCheck,
  checkById,
  checkByName,
  allChecks,
  checksByTag,
  editCheck,
  toggleCheck,
  deleteCheck,
  deleteAllCheck,
  deleteByTagName,
} = require("./controllers");

router.post("/", auth(["user"]), createCheck);

router.get("/", auth(["user"]), allChecks);

router.get("/tag/:tagName", auth(["user"]), checksByTag);

router.get("/name/:checkName", auth(["user"]), checkByName);

router.get("/:checkId", auth(["user"]), checkById);

router.patch("/:id", auth(["user"]), editCheck);

router.post("/pause/:id", auth(["user"]), toggleCheck);

router.delete("/all", auth(["user"]), deleteAllCheck);

router.delete("/tag/:tagName", auth(["user"]), deleteByTagName);

router.delete("/:id", auth(["user"]), deleteCheck);

module.exports = router;

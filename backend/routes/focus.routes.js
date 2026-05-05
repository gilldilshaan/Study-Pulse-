const express = require("express");
const router = express.Router();

/* TEMP EMPTY ROUTE */
router.get("/:userId", (req, res) => {
  res.json([]); // always safe
});

module.exports = router;
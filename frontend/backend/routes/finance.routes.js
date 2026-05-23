const express = require("express");
const router = express.Router();

let transactions = [];

/* GET */
router.get("/:userId", (req, res) => {
  const data = transactions.filter(t => t.userId === req.params.userId);
  res.json(data);
});

/* ADD */
router.post("/", (req, res) => {
  const tx = {
    _id: Date.now().toString(),
    ...req.body
  };

  transactions.push(tx);
  res.json(tx);
});

module.exports = router;
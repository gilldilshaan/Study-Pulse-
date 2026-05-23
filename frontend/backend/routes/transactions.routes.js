const express = require("express");
const router = express.Router();

const Transaction = require("../src/models/Transaction"); // ✅ use model
  
// GET
router.get("/:userId", async (req, res) => {
  try {
    const data = await Transaction.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
   //POST
router.post("/", async (req, res) => {
  try {
    const tx = new Transaction(req.body);
    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//PUT
router.put("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Updated" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
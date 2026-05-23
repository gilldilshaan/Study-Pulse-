const express = require("express");
const router = express.Router();

const Assignment = require("../src/models/Assignment");

/* =========================
   GET
========================= */

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await Assignment.find({ userId }).sort({ createdAt: -1 });

    res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("ASSIGNMENT GET ERROR:", err);
    res.json([]);
  }
});

/* =========================
   CREATE
========================= */

router.post("/", async (req, res) => {
  try {
    const { title, subject, userId, dueDate, status, progress } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const assignment = await Assignment.create({
      title,
      subject,
      userId,
      dueDate,
      status,
      progress
    });

    res.json(assignment);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ========================= */

router.delete("/:id", async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
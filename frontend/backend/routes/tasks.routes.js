const express = require("express");
const router = express.Router();

const Task = require("../src/models/Task");

/* =========================
   GET TASKS BY USER
========================= */

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    return res.json(Array.isArray(tasks) ? tasks : []);

  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    return res.json([]); // 🔒 always array
  }
});

/* =========================
   CREATE TASK
========================= */

router.post("/", async (req, res) => {
  try {
    const { title, priority, category, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const task = await Task.create({
      title,
      priority,
      category,
      userId,
      completed: false
    });

    return res.json(task);

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   UPDATE TASK
========================= */

router.put("/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    return res.json({ ok: true });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ message: "Update failed" });
  }
});

/* =========================
   DELETE TASK
========================= */

router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
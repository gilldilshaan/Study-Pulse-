const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./src/db/connect");

// ROUTES
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/tasks.routes");
const assignmentRoutes = require("./routes/assignments.routes");
const financeRoutes = require("./routes/finance.routes");
const transactionRoutes = require("./routes/transactions.routes");
// OPTIONAL (prevents dashboard 404)
const focusRoutes = require("./routes/focus.routes");

// MIDDLEWARE
const { notFound, errorHandler } = require("./src/middleware/error.middleware");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => res.json({ ok: true }));

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/finance", financeRoutes);

// 🔥 prevents dashboard crash
app.use("/api/focus", focusRoutes);
app.use("/api/transactions", transactionRoutes);

/* =========================
   ERROR HANDLING
========================= */

app.use(notFound);
app.use(errorHandler);

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("DB ERROR:", err.message);
    process.exit(1);
  });
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import challengeRoutes from "./routes/challenge.routes.js";
import "./cron/reminder.cron.js";
import { auth } from "./middlewares/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";


dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://21-days-sigma.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/challenge", challengeRoutes);
app.use("/api/tasks", taskRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Discipline API running 🚀");
});

// auth testing token 
app.get("/api/test/protected", auth, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});
// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error Details:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const port = process.env.PORT || 6000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

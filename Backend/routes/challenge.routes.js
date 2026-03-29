import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { create21DayChallenge } from "../services/challenge.service.js";
import {
  getActiveChallengeController,
  restart,
  fail,
  completeTask,
  getHeatmapData,
  startChallenge
} from "../controllers/challenge.controller.js";

const router = express.Router();

router.get("/active", auth, getActiveChallengeController);
router.post("/restart", auth, restart);
router.post("/fail", auth, fail);
router.post("/complete", auth, completeTask);
router.get("/heatmap", auth, getHeatmapData);
router.post("/start", auth, startChallenge);

// test route
router.post("/complete-test", (req, res) => {
  res.json({ ok: true });
});

export default router;

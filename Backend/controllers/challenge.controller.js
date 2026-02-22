import { getActiveChallenge } from "../services/challenge.service.js";
import { restartChallenge } from "../services/challenge.service.js";
import { failActiveChallenge } from "../services/challenge.service.js";
import * as challengeService from "../services/challenge.service.js";
import Challenge from "../models/Challenge.js";
import { create21DayChallenge } from "../services/challenge.service.js";


export async function startChallenge(req, res) {
  try {
    const challenge = await create21DayChallenge(req.user.id);
    res.json({ success: true, challenge });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}



export async function getActiveChallengeController(req, res) {
  try {
    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
  return res.status(200).json({
    success: false,
    challenge: null
  });
}


    res.json({ success: true, challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function restart(req, res) {
  try {
    const challenge = await restartChallenge(req.user.id);
    res.json({ success: true, challenge });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function fail(req, res) {
  try {
    const challenge = await failActiveChallenge(req.user.id);
    res.json({ success: true, challenge });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function completeTask(req, res) {
  try {
    const { dayNumber, taskIndex } = req.body;

    let challenge = await Challenge.findOne({
      user: req.user.id,
      status: "ACTIVE",
    });

    if (!challenge) {
      return res.status(200).json({
        success: false,
        message: "No active challenge",
      });
    }

    const day = challenge.days.find(
      (d) => d.dayNumber === Number(dayNumber)
    );

    if (!day) {
      return res.status(400).json({ message: "Invalid day" });
    }

    const task = day.tasks[taskIndex];
    if (!task) {
      return res.status(400).json({ message: "Invalid task" });
    }

    // 🔒 Block future days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);

    if (dayDate > today) {
      return res.status(403).json({
        message: "Future days are locked ⏳",
      });
    }

    // 🔁 Toggle task
    task.status =
      task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    // Check day completion
    day.completed = day.tasks.every(
      (t) => t.status === "COMPLETED"
    );

    await challenge.save();

    // ✅ CRITICAL FIX: re-fetch with populate
    challenge = await Challenge.findById(challenge._id)
      .populate("days.tasks.taskId");

    res.json({ success: true, challenge });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}




export const getHeatmapData = async (req, res) => {
  const challenge = await Challenge.findOne({
    user: req.user.id,
    status: "ACTIVE"
  });

  if (!challenge) return res.json({ heatmap: [] });

  const heatmap = challenge.days.map(day => {
    const completedTasks = day.tasks.filter(
      t => t.status === "COMPLETED"
    ).length;

    return {
      date: day.date,
      completed: day.completed,
      intensity: completedTasks / day.tasks.length
    };
  });

  res.json({ heatmap });
};

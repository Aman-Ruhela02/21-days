import UserTask from "../models/UserTask.js";
import Challenge from "../models/Challenge.js";
import { syncNewTaskToActiveChallenge } from "../services/challenge.service.js";
import { removeTaskFromActiveChallenge } from "../services/challenge.service.js";
import { addTaskToActiveChallenge } from "../services/challenge.service.js";

export async function getTasks(req, res) {
  const tasks = await UserTask.find({
    user: req.user.id,
    isActive: true
  });
  res.json({ tasks });
}

export const createTask = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Task name required" });
    }

    // 1️⃣ create user task
    const task = await UserTask.create({
      user: req.user.id,
      name,
      isActive: true,
    });

    // 2️⃣ sync with active challenge (if exists)
    await addTaskToActiveChallenge(req.user.id, task._id);

    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create task" });
  }
};

export async function updateTask(req, res) {
  const task = await UserTask.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { name: req.body.name },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ task });
}

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Delete from UserTask
    await UserTask.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    // 2️⃣ Remove from ACTIVE challenge
    await removeTaskFromActiveChallenge(req.user.id, id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

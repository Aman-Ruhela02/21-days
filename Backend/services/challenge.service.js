import Challenge from "../models/Challenge.js";
import { DAILY_TASKS } from "../config/tasks.js";
import { getDateString } from "../utils/date.utils.js";
import UserTask from "../models/UserTask.js";

export async function create21DayChallenge(userId) {
  const existing = await Challenge.findOne({
    user: userId,
    status: "ACTIVE",
  });

  if (existing) {
    throw new Error("User already has an active challenge");
  }

  // 🔥 GET USER CUSTOM TASKS
  const userTasks = await UserTask.find({
    user: userId,
    isActive: true,
  });

  if (userTasks.length === 0) {
    throw new Error("Please create tasks before starting a challenge");
  }

  const startDate = getDateString(new Date(), 0);
  const days = [];

  for (let i = 1; i <= 21; i++) {
    days.push({
      dayNumber: i,
      date: getDateString(new Date(), i - 1),
      tasks: userTasks.map(task => ({
        taskId: task._id,
        status: "PENDING",
      })),
      completed: false,
    });
  }

  return Challenge.create({
    user: userId,
    startDate,
    currentDay: 1,
    status: "ACTIVE",
    days,
  });

 
}

export async function addTaskToActiveChallenge(userId, taskId) {
  const challenge = await Challenge.findOne({
    user: userId,
    status: "ACTIVE",
  });

  if (!challenge) return;

  challenge.days.forEach((day) => {
    // only today + future days
    if (day.dayNumber >= challenge.currentDay) {
      day.tasks.push({
        taskId,
        status: "PENDING",
      });
    }
  });

  await challenge.save();
}



export async function getActiveChallenge(userId) {
  const challenge = await Challenge.findOne({
    user: userId,
    status: "ACTIVE",
  }).populate("days.tasks.taskId");

  if (!challenge) return null;
  

  const today = getDateString(new Date(), 0);

  const currentDayObj = challenge.days.find(
    (d) => d.dayNumber === challenge.currentDay
  );

  if (!currentDayObj) {
    throw new Error("Corrupted challenge data");
  }

  // 🚨 AUTO-FAIL CHECK
  if (today > currentDayObj.date) {
    challenge.status = "FAILED";
    challenge.failedAt = new Date();

    await challenge.save();
    return null; // No active challenge anymore
  }

  return challenge;
}


export async function completeTask(userId, dayNumber, taskIndex) {
  const challenge = await getActiveChallenge(userId);
  if (!challenge) throw new Error("No active challenge");

  const day = challenge.days.find(
    d => d.dayNumber === Number(dayNumber)
  );
  if (!day) throw new Error("Invalid day");

  // 🔒 STRICT: only current day allowed
  if (day.dayNumber !== challenge.currentDay) {
    throw new Error("You can only update the current day");
  }

  const task = day.tasks[taskIndex];
  if (!task) throw new Error("Invalid task");

  // 🔁 TOGGLE LOGIC
  task.status =
    task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

  // Check if all tasks are completed
  const allDone = day.tasks.every(
    t => t.status === "COMPLETED"
  );

  day.completed = allDone;

  // Move forward only if all done
  if (allDone && challenge.currentDay < 21) {
    challenge.currentDay += 1;
  }

  // If user unmarks, rollback day
  if (!allDone && challenge.currentDay > day.dayNumber) {
    challenge.currentDay = day.dayNumber;
  }

  await challenge.save();
  return challenge;
}




//auto-fail logic

function getTodayDateString() {
  return getDateString(new Date(), 0);
}

async function checkAndFailChallenge(challenge) {
  if (challenge.status !== "ACTIVE") return challenge;

  const today = getTodayDateString();

  // Find the current day object
  const currentDayObj = challenge.days.find(
    (d) => d.dayNumber === challenge.currentDay
  );

  // If today's date is AFTER current day date AND day not completed → FAIL
  if (
    today > currentDayObj.date &&
    currentDayObj.completed === false
  ) {
    challenge.status = "FAILED";
    await challenge.save();
  }

  return challenge;
}


//restart challenge 

export async function restartChallenge(userId) {
  // 1. Check if user already has ACTIVE challenge
  const active = await Challenge.findOne({
    user: userId,
    status: "ACTIVE",
  });

  if (active) {
    throw new Error("Active challenge already exists");
  }

  // 2. Mark previous FAILED/COMPLETED challenge as archived (optional but clean)
  await Challenge.updateMany(
    {
      user: userId,
      status: { $in: ["FAILED", "COMPLETED"] },
    },
    {
      $set: { archived: true },
    }
  );

  // 3. GET USER CUSTOM TASKS
  const userTasks = await UserTask.find({
    user: userId,
    isActive: true,
  });

  if (userTasks.length === 0) {
    throw new Error("Please create tasks before restarting a challenge");
  }

  // 4. Create fresh 21-day challenge
  const startDate = getDateString(new Date(), 0);
  const days = [];

  for (let i = 1; i <= 21; i++) {
    days.push({
      dayNumber: i,
      date: getDateString(new Date(), i - 1),
      tasks: userTasks.map(task => ({
        taskId: task._id,
        status: "PENDING",
      })),
      completed: false,
    });
  }

  return Challenge.create({
    user: userId,
    startDate,
    currentDay: 1,
    status: "ACTIVE",
    days,
  });
}



//fail active challenge 
export async function failActiveChallenge(userId) {
  const challenge = await Challenge.findOne({
    user: userId,
    status: "ACTIVE",
  });

  if (!challenge) {
    throw new Error("No active challenge to fail");
  }

  challenge.status = "FAILED";
  challenge.failedAt = new Date();

  await challenge.save();
  return challenge;
}





// services/challenge.service.js
export async function completeDay(userId, dayNumber, completed) {
  const challenge = await getActiveChallenge(userId);
  if (!challenge) throw new Error("No active challenge");

  const day = challenge.days.find(d => d.dayNumber === Number(dayNumber));
  if (!day) throw new Error("Invalid day");

  if (dayNumber !== challenge.currentDay) {
    throw new Error("You can only complete the current day");
  }

  // Mark all tasks completed/uncompleted based on `completed`
  day.tasks.forEach(task => {
    task.status = completed ? "COMPLETED" : "PENDING";
  });

  day.completed = completed;

  // Move to next day if completed
  if (completed && challenge.currentDay < 21) {
    challenge.currentDay += 1;
  }

  // Mark challenge complete if last day
  if (completed && dayNumber === 21) {
    challenge.status = "COMPLETED";
  }

  // If unmarking the day, reset currentDay
  if (!completed && challenge.currentDay > dayNumber) {
    challenge.currentDay = dayNumber;
  }

  await challenge.save();
  return challenge;
}



export async function syncNewTaskToActiveChallenge(userId, taskId) {
  const challenge = await Challenge.findOne({
    user: userId,
    status: "ACTIVE",
  });

  if (!challenge) return;

  challenge.days.forEach((day) => {
    day.tasks.push({
      taskId,
      status: "PENDING",
    });
  });

  await challenge.save();
}



export async function removeTaskFromActiveChallenge(userId, taskId) {
  const challenge = await Challenge.findOne({
    user: userId,
    status: "ACTIVE",
  });

  // No active challenge → nothing to sync
  if (!challenge) return;

  challenge.days.forEach((day) => {
    day.tasks = day.tasks.filter(
      (t) => t.taskId.toString() !== taskId.toString()
    );
  });

  await challenge.save();
}

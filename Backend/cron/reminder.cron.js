import cron from "node-cron";
import { sendDailyReminders } from "../services/reminder.service.js";

// Runs every day at 8 AM
cron.schedule("0 8 * * *", async () => {
  console.log("⏰ Running daily reminder job");
  await sendDailyReminders();
});

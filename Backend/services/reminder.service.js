import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import { getDateString } from "../utils/date.utils.js";

export async function sendDailyReminders() {
  const today = getDateString(new Date(), 0);

  const users = await User.find({
    reminderEnabled: true,
  });

  for (const user of users) {
    const challenge = await Challenge.findOne({
      user: user._id,
      status: "ACTIVE",
    });

    if (!challenge) continue;

    const todayDay = challenge.days.find(
      (d) =>
        d.dayNumber === challenge.currentDay &&
        d.date === today
    );

    if (!todayDay) continue;

    if (!todayDay.completed) {
      // 🔔 SEND REMINDER
      console.log(
        `🔔 Reminder sent to ${user.email} for Day ${challenge.currentDay}`
      );

      // Later replace with:
      // sendEmail(user.email)
      // sendPushNotification(user._id)
    }
  }
}

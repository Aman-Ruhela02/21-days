import {
  FaCheckCircle,
  FaLock,
  FaRegCircle
} from "react-icons/fa";

export default function ChallengeBoard({ challenge, onToggleTask }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        🚀 Your 21-Day Challenge
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {challenge.days.map((day) => {
          const isFutureDay = day.dayNumber > challenge.currentDay;
          const isToday = day.dayNumber === challenge.currentDay;

          return (
            <div
              key={day.dayNumber}
              className={`
                relative p-4 rounded-2xl border shadow-sm transition
                ${day.completed ? "bg-green-50 border-green-300" : "bg-white"}
                ${isToday ? "ring-2 ring-blue-500" : ""}
                ${isFutureDay ? "opacity-60" : ""}
              `}
            >
              {/* DAY HEADER */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    Day {day.dayNumber}
                  </span>

                  {day.completed && (
                    <FaCheckCircle className="text-green-600" />
                  )}

                  {isFutureDay && (
                    <FaLock className="text-gray-400" />
                  )}
                </div>

                {isToday && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                    Today
                  </span>
                )}
              </div>

              {/* TASK LIST */}
              <ul className="space-y-2 text-sm">
                {day.tasks.map((task, i) => (
                  <li
                    key={task.taskId?._id || i}
                    className={`flex items-center gap-2
                      ${task.status === "COMPLETED"
                        ? "text-gray-500 line-through"
                        : ""
                      }`}
                  >
                    {!isFutureDay ? (
                      <button
                        onClick={() =>
                          onToggleTask(day.dayNumber, i)
                        }
                        className="focus:outline-none"
                      >
                        {task.status === "COMPLETED" ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaRegCircle className="text-gray-400" />
                        )}
                      </button>
                    ) : (
                      <FaLock className="text-gray-400" />
                    )}

                    <span>
                      {task.taskId?.name || "Deleted Task"}
                    </span>
                  </li>
                ))}
              </ul>

              {/* FUTURE DAY MESSAGE */}
              {isFutureDay && (
                <div className="mt-4 text-xs text-gray-400 text-center">
                  🔒 Unlocks on <br />
                  <span className="font-medium">
                    {new Date(day.date).toDateString()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

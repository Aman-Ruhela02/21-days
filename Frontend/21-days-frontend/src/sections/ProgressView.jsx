export default function ProgressView({ days }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Progress Overview</h2>

      <div className="space-y-3">
        {days.map(day => {
          const completed = day.tasks.filter(t => t.status === "COMPLETED").length;
          const percent = Math.round((completed / day.tasks.length) * 100);

          return (
            <div key={day.dayNumber}>
              <div className="flex justify-between mb-1">
                <span>Day {day.dayNumber}</span>
                <span>{percent}%</span>
              </div>

              <div className="h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-blue-500 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

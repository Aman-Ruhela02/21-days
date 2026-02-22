const AnalyticsDashboard = ({ days }) => {
  const totalDays = days.length;

  const dayStats = days.map(day => {
    const total = day.tasks.length;
    const completed = day.tasks.filter(t => t.status === "COMPLETED").length;
    const percent = Math.round((completed / total) * 100);

    return { ...day, percent };
  });

  const completedDays = dayStats.filter(d => d.percent === 100).length;

  const bestDay = dayStats.reduce((a, b) =>
    a.percent > b.percent ? a : b
  );

  const worstDay = dayStats.reduce((a, b) =>
    a.percent < b.percent ? a : b
  );

  const consistencyScore = Math.round(
    (completedDays / totalDays) * 100
  );

  return (
    <div className="bg-white dark:bg-white-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">
        📊 Discipline Analytics
      </h2>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Completed Days" value={`${completedDays}/${totalDays}`} />
        <StatCard label="Consistency Score" value={`${consistencyScore}%`} />
        <StatCard label="Best Day" value={`Day ${bestDay.dayNumber}`} />
        <StatCard label="Weakest Day" value={`Day ${worstDay.dayNumber}`} />
      </div>

      {/* Progress Trend */}
      <h3 className="font-semibold mb-3">📈 Daily Progress Trend</h3>

      <div className="space-y-2">
        {dayStats.map(day => (
          <div key={day.dayNumber}>
            <div className="flex justify-between text-sm mb-1">
              <span>Day {day.dayNumber}</span>
              <span>{day.percent}%</span>
            </div>

            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  day.percent === 100
                    ? "bg-green-600"
                    : day.percent >= 50
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${day.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
    <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default AnalyticsDashboard;

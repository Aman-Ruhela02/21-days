import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function CalendarHeatmap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/challenge/heatmap`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(res.data.heatmap);
    };

    fetchHeatmap();
  }, []);

  const getColor = (intensity) => {
    if (intensity === 0) return "bg-gray-200";
    if (intensity < 0.4) return "bg-green-200";
    if (intensity < 0.7) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Daily Discipline</h2>

      <div className="grid grid-cols-7 gap-2">
        {data.map((day, i) => (
          <div
            key={i}
            title={day.date}
            className={`w-6 h-6 rounded ${getColor(day.intensity)}`}
          />
        ))}
      </div>

      <div className="flex gap-2 mt-4 text-xs items-center">
        <span>Less</span>
        <div className="w-4 h-4 bg-gray-200 rounded" />
        <div className="w-4 h-4 bg-green-200 rounded" />
        <div className="w-4 h-4 bg-green-400 rounded" />
        <div className="w-4 h-4 bg-green-600 rounded" />
        <span>More</span>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://two1-days-rlrw.onrender.com/api";

export default function TaskManager({ onTaskChange, onStartChallenge, hasChallenge }) {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");

  const auth = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  };

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/tasks`, auth);
    setTasks(res.data.tasks || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!name.trim()) return toast.error("Task name required");

    await axios.post(`${API}/tasks`, { name }, auth);
    setName("");
    fetchTasks();
    onTaskChange?.();
    toast.success("Task added ✅");
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`, auth);
    fetchTasks();
    onTaskChange?.();
    toast.success("Task deleted");
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Daily Tasks</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 flex-1 rounded-lg"
          placeholder="e.g. Gym, Read 20 min"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3 mb-6">
        {tasks.map(t => (
          <li
            key={t._id}
            className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg"
          >
            <span>{t.name}</span>
            <button
              onClick={() => deleteTask(t._id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {!hasChallenge && tasks.length > 0 && (
        <button
          onClick={onStartChallenge}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg"
        >
          Start 21-Day Challenge 🚀
        </button>
      )}
    </div>
  );
}

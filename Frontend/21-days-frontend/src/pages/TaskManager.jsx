import { useEffect, useState } from "react";
import api from "../api";

export default function TaskManager({ onTaskChange, onStartChallenge, hasChallenge }) {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Task name required");

    try {
      await api.post(`/tasks`, { name });
      setName("");
      fetchTasks();
      onTaskChange?.();
      toast.success("Task added ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      onTaskChange?.();
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Daily Tasks</h2>

      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 flex-1 rounded-lg"
          placeholder="e.g. Gym, Read 20 min"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Add
        </button>
      </form>

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

import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";

import {
  FaList,
  FaCalendarAlt,
  FaChartLine,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

import TaskManager from "../pages/TaskManager";
import ChallengeBoard from "../sections/ChallengeBoard";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import CalendarHeatmap from "../components/CalendarHeatmap";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [challenge, setChallenge] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ---------- FETCH ---------- */

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [userRes, tasksRes, challengeRes] = await Promise.all([
        api.get(`/auth/me`),
        api.get(`/tasks`),
        api.get(`/challenge/active`),
      ]);
      setUser(userRes.data.user);
      setTasks(tasksRes.data.tasks || []);
      setChallenge(challengeRes.data.challenge || null);
    } catch (err) {
      console.error("Dashboard data error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return logout();
    fetchData();
  }, []);

  /* ---------- ACTIONS ---------- */

  const startChallenge = async () => {
    try {
      const res = await api.post(`/challenge/start`, {});
      setChallenge(res.data.challenge);
      toast.success("Challenge started 🚀");
      setActiveTab("dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start challenge");
    }
  };

  const toggleTask = async (dayNumber, taskIndex) => {
    const res = await api.post(
      `/challenge/complete`,
      { dayNumber, taskIndex }
    );
    setChallenge(res.data.challenge);
  };




  /* ---------- UI ---------- */

  return (
    
    <div className="flex min-h-screen bg-gray-100 ">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-40 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-20 w-64 bg-white h-full shadow-lg transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg">Discipline-App</span>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarItem icon={<FaList />} label="Tasks" onClick={() => setActiveTab("tasks")} />
          <SidebarItem icon={<FaCalendarAlt />} label="Dashboard" onClick={() => setActiveTab("dashboard")} />
          <SidebarItem icon={<FaChartLine />} label="Analytics" onClick={() => setActiveTab("analytics")} />
          <SidebarItem icon={<FaUser />} label={user.username} disabled />
          <SidebarItem icon={<FaSignOutAlt />} label="Logout" danger onClick={logout} />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-6">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center gap-3 mb-4">
          <button onClick={() => setSidebarOpen(true)}>
            <FaBars size={22} />
          </button>
          <h1 className="font-bold text-lg">Dashboard</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeTab === "tasks" && (
              <TaskManager
                hasChallenge={!!challenge}
                onStartChallenge={startChallenge}
                onTaskChange={fetchData}
              />
            )}

        {activeTab === "dashboard" && (
          <>
            {tasks.length === 0 && (
              <EmptyState
                title="Create tasks to start your challenge"
                button="Go to Task Manager"
                action={() => setActiveTab("tasks")}
              />
            )}

            {tasks.length > 0 && !challenge && (
              <EmptyState
                title="Ready for your 21-day challenge?"
                button="Start Challenge 🚀"
                action={startChallenge}
              />
            )}

            {challenge && (
              <ChallengeBoard
                challenge={challenge}
                onToggleTask={toggleTask}
              />
            )}
          </>
        )}

        {activeTab === "analytics" && challenge && (
          <div className="space-y-6">
            <AnalyticsDashboard days={challenge.days} />
            <CalendarHeatmap />
          </div>
        )}
        </>
        )}
      </main>

      <ToastContainer />
    </div>
    
  );
}

/* ---------- UI PARTS ---------- */

const SidebarItem = ({ icon, label, onClick, danger, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
      ${danger ? "text-red-500 hover:bg-red-50" : "hover:bg-gray-100"}
      ${disabled ? "text-gray-400 cursor-default" : ""}
    `}
  >
    {icon}
    {label}
  </button>
);

const EmptyState = ({ title, button, action }) => (
  <div className="bg-white p-6 md:p-8 rounded-xl shadow text-center max-w-lg mx-auto">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <button
      onClick={action}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg"
    >
      {button}
    </button>
  </div>
  

 );

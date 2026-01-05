import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { formatDisplayDate } from "../utils/date";

export default function TaskList({ refresh, onEdit }) {
  const [tasks, setTasks] = useState([]);
  const [openTask, setOpenTask] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [filter, setFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const res = await API.get(`/tasks?page=${pageNum}`);
      const newTasks = res.data;
      if (append) {
        setTasks((prev) => [...prev, ...newTasks]);
      } else {
        setTasks(newTasks);
      }
      setHasMore(newTasks.length > 0);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchTasks(1, false);
  }, [refresh]);

  const toggle = (id) => setOpenTask(openTask === id ? null : id);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      setLoadingDelete(id);
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleStatusToggle = async (task) => {
    try {
      const newStatus = task.status === "pending" ? "completed" : "pending";
      const res = await API.put(`/tasks/${task._id}`, {
        ...task,
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const displayedTasks = tasks.filter(
    (t) => filter === "all" || t.priority === filter
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-3">
        {["all", "low", "medium", "high"].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`flex-1 py-1 rounded font-medium text-white transition-colors duration-200 ${
              filter === p
                ? p === "low"
                  ? "bg-green-500"
                  : p === "medium"
                  ? "bg-yellow-500"
                  : p === "high"
                  ? "bg-red-500"
                  : "bg-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Task list */}
      {displayedTasks.map((task) => (
        <div
          key={task._id}
          className="border rounded overflow-hidden shadow-sm"
        >
          <div
            className={`flex justify-between items-center p-3 font-semibold cursor-pointer
              ${task.priority === "high" ? "bg-red-200" : ""}
              ${task.priority === "medium" ? "bg-yellow-200" : ""}
              ${task.priority === "low" ? "bg-green-200" : ""}`}
            onClick={() => toggle(task._id)}
          >
            <span>{task.title.trim()}</span>
            <span>{openTask === task._id ? "-" : "+"}</span>
          </div>

          {openTask === task._id && (
            <div className="p-3 bg-gray-50 flex flex-col gap-2">
              <p className="text-gray-700">{task.description.trim()}</p>
              <p className="text-sm text-gray-500">
                Due:{" "}
                {task.dueDate ? formatDisplayDate(task.dueDate) : "No due date"}
              </p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleStatusToggle(task)}
                  className={`flex-1 py-1 rounded text-white ${
                    task.status === "pending"
                      ? "bg-black hover:bg-gray-800"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  Mark {task.status === "pending" ? "Completed" : "Pending"}
                </button>
                <button
                  onClick={() => onEdit(task)}
                  className="flex-1 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  disabled={loadingDelete === task._id}
                  className={`flex-1 py-1 rounded text-white ${
                    loadingDelete === task._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {loadingDelete === task._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            disabled={loading}
            onClick={() => {
              const nextPage = page + 1;
              fetchTasks(nextPage, true);
              setPage(nextPage);
            }}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { FiCalendar, FiEdit2, FiClipboard } from "react-icons/fi";
import { formatDisplayDate } from "../../utils/date";

export default function TaskForm({ taskToEdit, onSubmitComplete }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "pending",
    _id: null,
  });
  const [loading, setLoading] = useState(false);
  const hiddenDateRef = useRef();

  useEffect(() => {
    if (taskToEdit) {
      setTask({
        ...taskToEdit,
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate : "",
      });
    } else {
      setTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        status: "pending",
        _id: null,
      });
    }
  }, [taskToEdit]);

  const submit = async () => {
    if (!task.title.trim() || !task.description.trim()) return;

    try {
      setLoading(true);
      const payload = {
        ...task,
        title: task.title.trim(),
        description: task.description.trim(),
      };
      if (task._id) {
        await API.put(`/tasks/${task._id}`, payload);
        toast.success("Task updated");
      } else {
        await API.post("/tasks", payload);
        toast.success("Task added");
      }
      onSubmitComplete?.();
      setTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        status: "pending",
        _id: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow-md mb-4">
      {/* Title */}
      <div className="relative mb-2">
        <input
          className="w-full border p-2 pr-10 rounded focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
        <FiEdit2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Description */}
      <div className="relative mb-2">
        <textarea
          className="w-full border p-2 pr-10 rounded focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
        <FiClipboard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Due Date */}
      <div className="relative mb-2">
        <input
          ref={hiddenDateRef}
          type="date"
          className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
          value={task.dueDate ? task.dueDate : ""}
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        />
        <input
          type="text"
          className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="DUE DATE (DD-MM-YYYY)"
          value={formatDisplayDate(task.dueDate)}
          onFocus={() => hiddenDateRef.current.showPicker?.()}
          readOnly
        />
        <span className="absolute right-2 top-2.5 text-gray-500 pointer-events-none">
          <FiCalendar />
        </span>
      </div>

      <div className="flex gap-2 mb-2">
        {["low", "medium", "high"].map((p) => (
          <button
            key={p}
            type="button"
            className={`flex-1 py-1 rounded text-white font-medium ${
              task.priority === p
                ? p === "low"
                  ? "bg-green-500"
                  : p === "medium"
                  ? "bg-yellow-500"
                  : "bg-red-500"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setTask({ ...task, priority: p })}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        disabled={!task.title.trim() || !task.description.trim() || loading}
        onClick={submit}
        className={`w-full py-2 rounded text-white ${
          !task.title.trim() || !task.description.trim() || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {loading
          ? task._id
            ? "Updating..."
            : "Adding..."
          : task._id
          ? "Update Task"
          : "Add Task"}
      </button>
    </div>
  );
}

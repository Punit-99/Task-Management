import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { FiCalendar, FiEdit2, FiClipboard } from "react-icons/fi";
import { formatDisplayDate } from "../../utils/date";
import styles from "./TaskForm.module.css";

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
        dueDate: taskToEdit.dueDate || "",
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
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.field}>
        <input
          className={styles.input}
          placeholder="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
        <FiEdit2 className={styles.icon} />
      </div>

      {/* Description */}
      <div className={styles.field}>
        <textarea
          className={styles.textarea}
          placeholder="Description"
          value={task.description}
          onChange={(e) =>
            setTask({ ...task, description: e.target.value })
          }
        />
        <FiClipboard className={styles.icon} />
      </div>

      {/* Due Date */}
      <div className={styles.field}>
        <input
          ref={hiddenDateRef}
          type="date"
          className={styles.hiddenDate}
          value={task.dueDate}
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        />

        <input
          type="text"
          className={styles.input}
          placeholder="DUE DATE (DD-MM-YYYY)"
          value={formatDisplayDate(task.dueDate)}
          onFocus={() => hiddenDateRef.current.showPicker?.()}
          readOnly
        />
        <FiCalendar className={styles.icon} />
      </div>

      {/* Priority */}
      <div className={styles.priorityGroup}>
        {["low", "medium", "high"].map((p) => (
          <button
            key={p}
            type="button"
            className={`${styles.priorityBtn} ${
              task.priority === p
                ? styles[`${p}Active`]
                : styles.inactive
            }`}
            onClick={() => setTask({ ...task, priority: p })}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        disabled={!task.title.trim() || !task.description.trim() || loading}
        onClick={submit}
        className={`${styles.submitBtn} ${
          !task.title.trim() || !task.description.trim() || loading
            ? styles.disabled
            : ""
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

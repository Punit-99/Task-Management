import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { formatDisplayDate } from "../../utils/date";
import styles from "./TaskList.module.css";

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
      const newTasks = res.data || [];

      if (append) {
        setTasks((prev) => [...prev, ...newTasks]);
      } else {
        setTasks(newTasks);
      }

      setHasMore(newTasks.length > 0);
    } catch {
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
      setTasks((prev) => prev.filter((t) => t._id !== id));
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
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      toast.success(`Task marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const displayedTasks = tasks.filter(
    (t) => filter === "all" || t.priority === filter
  );

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filterBar}>
        {["all", "low", "medium", "high"].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`${styles.filterBtn} ${
              filter === p
                ? styles[
                    p === "all"
                      ? "filterAll"
                      : p === "low"
                      ? "filterLow"
                      : p === "medium"
                      ? "filterMedium"
                      : "filterHigh"
                  ]
                : styles.filterInactive
            }`}
          >
            {p === "all" ? "All" : p.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tasks */}
      {displayedTasks.map((task) => (
        <div key={task._id} className={styles.taskCard}>
          <div
            className={`${styles.taskHeader} ${styles[task.priority] || ""}`}
            onClick={() => toggle(task._id)}
          >
            <span>{task.title.trim()}</span>
            <span>{openTask === task._id ? "-" : "+"}</span>
          </div>

          {openTask === task._id && (
            <div className={styles.taskBody}>
              <p className={styles.text}>{task.description.trim()}</p>
              <p className={styles.meta}>
                Due:{" "}
                {task.dueDate ? formatDisplayDate(task.dueDate) : "No due date"}
              </p>
              <p className={styles.meta}>Status: {task.status}</p>

              <div className={styles.actionRow}>
                <button
                  onClick={() => handleStatusToggle(task)}
                  className={`${styles.btn} ${
                    task.status === "pending" ? styles.black : styles.green
                  }`}
                >
                  Mark {task.status === "pending" ? "Completed" : "Pending"}
                </button>

                <button
                  onClick={() => onEdit(task)}
                  className={`${styles.btn} ${styles.blue}`}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  disabled={loadingDelete === task._id}
                  className={`${styles.btn} ${
                    loadingDelete === task._id ? styles.disabled : styles.red
                  }`}
                >
                  {loadingDelete === task._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Load more */}
      {hasMore && (
        <div className={styles.loadMoreWrap}>
          <button
            disabled={loading}
            onClick={() => {
              const nextPage = page + 1;
              fetchTasks(nextPage, true);
              setPage(nextPage);
            }}
            className={styles.loadMoreBtn}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

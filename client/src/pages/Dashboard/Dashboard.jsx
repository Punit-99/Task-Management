import { useState } from "react";
import TaskForm from "../../components/TaskForm/TaskForm";
import TaskList from "../../components/TaskList/TaskList";
import { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />

      <TaskForm
        taskToEdit={taskToEdit}
        onSubmitComplete={() => {
          setTaskToEdit(null);
          setRefresh(!refresh);
        }}
      />

      <TaskList
        refresh={refresh}
        onEdit={(task) => setTaskToEdit(task)}
        onTaskUpdated={() => setRefresh(!refresh)}
      />
    </div>
  );
}

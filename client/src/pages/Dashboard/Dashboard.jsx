import { useState } from "react";
import TaskForm from "../../components/TaskForm/TaskForm";
import TaskList from "../../components/TaskList/TaskList";
import Navbar from "../../components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  return (
    <>
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />

      <div className={styles.container}>
        <TaskForm
          taskToEdit={taskToEdit}
          onSubmitComplete={() => {
            setTaskToEdit(null);
            setRefresh(!refresh);
          }}
        />

        <TaskList refresh={refresh} onEdit={(task) => setTaskToEdit(task)} />
      </div>
    </>
  );
}

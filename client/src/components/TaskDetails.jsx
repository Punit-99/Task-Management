import API from "../services/api";
import { useEffect, useState } from "react";

export default function TaskDetails({ id }) {
  const [task, setTask] = useState({});

  useEffect(() => {
    API.get(`/tasks/${id}`).then((res) => setTask(res.data));
  }, []);

  return (
    <>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>{task.dueDate}</p>
    </>
  );
}

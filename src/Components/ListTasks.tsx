import { useEffect, useState } from "react";
import TaskItem, { Task } from "./TaskItem";

function ListTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/tasks/active");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      {tasks.length > 0 ? (
        tasks.map((task: Task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={() => deleteTask(task.id)}
          />
        ))
      ) : (
        <p>You currently do not have any tasks!</p>
      )}
    </>
  );
}

export default ListTasks;

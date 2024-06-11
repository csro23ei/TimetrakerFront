import { useEffect, useState } from "react";
import { Task } from "./TaskItem";
import formatTime from "./Utilities/FormatTimeStats";

function ListInactiveTasks() {
  const [inactiveTasks, setInactiveTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchInactiveTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/tasks/deleted");
        const data = await response.json();
        setInactiveTasks(data);
      } catch (error) {
        console.error("Error fetching inactive tasks:", error);
      }
    };

    fetchInactiveTasks();
  }, []);

  const handleHardDelete = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/task/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInactiveTasks((prevInactiveTasks) =>
          prevInactiveTasks.filter((task) => task.id !== taskId)
        );
        console.log("Task successfully deleted");
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="taskContainer">
      <h2>Inactive tasks:</h2>
      <p className="statisticsText">View time spent on tasks in total:</p>
      {inactiveTasks.length === 0 ? (
        <p>You do not have any inactive tasks.</p>
      ) : (
        inactiveTasks.map((task) => (
          <div key={task.id}>
            <h3>Task name: {task.taskName}</h3>
            <p className="timer">Time: {formatTime(task.time)}</p>
            <p>Creation date: {task.taskDate}</p>
            <button
              className="deleteBtn"
              onClick={() => handleHardDelete(task.id)}
            >
              Delete forever
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ListInactiveTasks;

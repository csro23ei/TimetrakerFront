import { useEffect, useState } from "react";
import { Task } from "./TaskItem";
import formatTime from "./Utilities/FormatTimeStats";

function ListActiveTasks() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchActiveTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/tasks/active");
        const data = await response.json();
        setActiveTasks(data);
      } catch (error) {
        console.error("Error fetching active tasks:", error);
      }
    };

    fetchActiveTasks();
  }, []);

  return (
    <div className="taskContainer">
      <h2>Active tasks:</h2>
      <p className="statisticsText">View time spent on tasks this week:</p>
      {activeTasks.length === 0 ? (
        <p>You do not have any active tasks.</p>
      ) : (
        activeTasks.map((task) => (
          <div key={task.id}>
            <h3>Task name: {task.taskName}</h3>
            <p className="timer">Time: {formatTime(task.time)}</p>
            <p>Creation date: {task.taskDate}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ListActiveTasks;

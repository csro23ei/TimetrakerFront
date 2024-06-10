import { useEffect, useState } from "react";
import formatTime from "./Utilities/FormatTimeStats";

export interface Task {
  id: string;
  taskName: string;
  taskDate: string;
  time: number;
}

function TaskItem({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const deleteTask = async () => {
    try {
      await fetch(`http://localhost:8080/task/${task.id}/soft`, {
        method: "DELETE",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(`http://localhost:8080/task/${task.id}/time`);
        const data = await response.json();
        setTime(data);
      } catch (error) {
        console.error("Error fetching task time:", error);
      }
    };

    fetchTime();
  }, [task.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const saveTime = async () => {
    setTimerRunning(false);

    try {
      await fetch(`http://localhost:8080/task/${task.id}/time`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time }),
      });
    } catch (error) {
      console.error("Error saving task time:", error);
    }
  };

  return (
    <div key={task.id} className="taskContainer">
      <h3>{task.taskName}</h3>
      {timerRunning ? (
        <button className="stopBtn" onClick={saveTime}>
          Stop timer
        </button>
      ) : (
        <button className="startBtn" onClick={() => setTimerRunning(true)}>
          Start timer
        </button>
      )}
      <span className="timer">{formatTime(time)}</span>
      <button className="deleteBtn" onClick={deleteTask}>
        Delete
      </button>
    </div>
  );
}

export default TaskItem;

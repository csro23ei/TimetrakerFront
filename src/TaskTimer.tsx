// src/Task/TaskTimer.tsx
import React, { useEffect, useState } from 'react';
import { Task } from './task'; // Import the Task interface

interface TaskTimerProps {
  task: Task;
  stopTask: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ task, stopTask }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = new Date(task.taskDate).getTime();
    const interval = setInterval(() => {
      setElapsedTime((new Date().getTime() - startTime) / 1000 / 60); // Time in minutes
    }, 1000);

    return () => clearInterval(interval);
  }, [task]);

  return (
    <div>
      <h3>Current Task: {task.taskName}</h3>
      <p>Elapsed Time: {elapsedTime.toFixed(2)} minutes</p>
      <button onClick={stopTask}>Stop Task</button>
    </div>
  );
};

export default TaskTimer;

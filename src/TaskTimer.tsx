import React, { useState, useEffect } from 'react';
import { Task } from './task';
import { formatTime } from './timeUtils';

interface TaskTimerProps {
  task: Task;
  stopTask: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ task, stopTask }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = new Date(task.taskDate).getTime();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - startTime) / 1000)); // Set in seconds
    }, 1000);

    return () => clearInterval(interval);
  }, [task]);

  return (
    <div>
      <h3>Current Task: {task.taskName}</h3>
      <p>Elapsed Time: {formatTime(elapsedTime)}</p>
      <button onClick={stopTask}>Stop Task</button>
    </div>
  );
};

export default TaskTimer;

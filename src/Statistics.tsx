// src/Task/Statistics.tsx
import React from 'react';
import { Task } from './task'; // Import the Task interface

interface StatisticsProps {
  tasks: Task[];
}

const Statistics: React.FC<StatisticsProps> = ({ tasks }) => {
  const totalTime = tasks.reduce((total, task) => total + task.time, 0);

  return (
    <div>
      <h2>Statistics</h2>
      <p>Total Time Spent on Tasks: {totalTime} minutes</p>
    </div>
  );
};

export default Statistics;

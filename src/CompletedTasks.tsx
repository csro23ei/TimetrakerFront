import React from 'react';
import { Task } from './task'; 
import { formatTime } from './timeUtils';

interface CompletedTasksProps {
  tasks: Task[];
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ tasks }) => {
  return (
    <div>
      <h2>Completed Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.taskName} - {formatTime(task.time * 60)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTasks;

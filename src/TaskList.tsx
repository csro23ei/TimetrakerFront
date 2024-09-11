// src/Task/TaskList.tsx
import React from 'react';
import { Task } from './task'; // Import the Task interface

interface TaskListProps {
  tasks: Task[];
  editTask: (id: string, updatedTask: Partial<Task>) => void;
  startTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, editTask, startTask }) => {
  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.taskName} - {task.time} mins
            <button onClick={() => startTask(task)}>Start</button>
            <button onClick={() => editTask(task.id, { taskName: task.taskName })}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

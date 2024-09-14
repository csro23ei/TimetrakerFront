import React from 'react';
import { Task } from './task'; 

interface TaskListProps {
  tasks: Task[];
  removeTask: (id: string) => void;
  startTask?: (task: Task) => void;
  title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, removeTask, startTask, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.taskName} - {task.time} mins
            {startTask && <button onClick={() => startTask(task)}>Start</button>}
            <button onClick={() => removeTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

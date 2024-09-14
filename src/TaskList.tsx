import React from 'react';
import { Task } from './task';

interface TaskListProps {
  tasks: (Task & { timeFormatted: string })[];
  removeTask: (id: string) => void;
  startTask?: (task: Task) => void;
  editTask?: (id: string, newName: string) => void;
  title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, removeTask, startTask, editTask, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.taskName} - {task.timeFormatted} 
            {startTask && <button onClick={() => startTask(task)}>Start</button>}
            <button onClick={() => removeTask(task.id)}>Delete</button>
            {editTask && <button onClick={() => editTask(task.id, 'New Task Name')}>Edit</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

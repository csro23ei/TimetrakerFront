// src/Task/TaskForm.tsx
import React, { useState } from 'react';
import { NewTask } from './task'; // Import the NewTask interface

interface TaskFormProps {
  addTask: (task: NewTask) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
  const [taskName, setTaskName] = useState('');
  const [time, setTime] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({ taskName, time, deleted: false });
    setTaskName('');
    setTime(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Time (minutes)"
        value={time}
        onChange={(e) => setTime(parseInt(e.target.value))}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
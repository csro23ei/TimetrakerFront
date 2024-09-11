// App.tsx
import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskTimer from './TaskTimer';
import Statistics from './Statistics';
import { Task, NewTask } from './task'; // Import interfaces consistently

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Fetch tasks from the backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/tasks/active');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add new task
  const addTask = async (task: NewTask) => {
    try {
      const response = await fetch('/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const data: Task = await response.json();
      setTasks([...tasks, data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Edit task
  const editTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await fetch(`/task/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to edit task');
      }

      const data: Task = await response.json();
      setTasks(tasks.map((task) => (task.id === id ? data : task)));
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // Start task (Check-in)
  const startTask = (task: Task) => {
    setCurrentTask({ ...task, taskDate: new Date().toISOString() });
  };

  // Stop task (Check-out)
  const stopTask = async () => {
    if (currentTask) {
      const endTime = new Date();
      const startTime = new Date(currentTask.taskDate);
      const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000 / 60; // Time in minutes

      try {
        const response = await fetch(`/task/${currentTask.id}/time`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ time: currentTask.time + timeSpent }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task time');
        }

        setCurrentTask(null);
        fetchTasks(); // Refresh tasks to update the time
      } catch (error) {
        console.error('Error stopping task:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Time Tracker</h1>
      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} editTask={editTask} startTask={startTask} />
      {currentTask && <TaskTimer task={currentTask} stopTask={stopTask} />}
      <Statistics tasks={tasks} />
    </div>
  );
}

export default App;
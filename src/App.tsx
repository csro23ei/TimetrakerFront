import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskTimer from './TaskTimer';
import Statistics from './Statistics';
import { Task, NewTask } from './task'; 

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/tasks/tasks/active');
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

 
  const addTask = async (task: NewTask) => {
    try {
      const response = await fetch('http://localhost:8080/tasks/task', {
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

  
  const removeTask = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/task/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove task');
      }

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  
  const startTask = (task: Task) => {
    setCurrentTask({ ...task, taskDate: new Date().toISOString() });
  };

 
  const stopTask = async () => {
    if (currentTask) {
      const endTime = new Date();
      const startTime = new Date(currentTask.taskDate);
      const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000 / 60; // Time in minutes

      try {
        const response = await fetch(`http://localhost:8080/tasks/task/${currentTask.id}/time`, {
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
        fetchTasks(); 
      } catch (error) {
        console.error('Error stopping task:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Time Tracker</h1>
      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} removeTask={removeTask} startTask={startTask} />
      {currentTask && <TaskTimer task={currentTask} stopTask={stopTask} />}
      <Statistics tasks={tasks} />
    </div>
  );
}

export default App;

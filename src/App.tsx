import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskTimer from './TaskTimer';
import { Task, NewTask } from './task'; 

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchActiveTasks();
    fetchCompletedTasks();
  }, []);

  const fetchActiveTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/tasks/tasks/active');
      if (!response.ok) {
        throw new Error(`Failed to fetch active tasks: ${response.status} ${response.statusText}`);
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching active tasks:', error);
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/tasks/tasks/completed');
      if (!response.ok) {
        throw new Error(`Failed to fetch completed tasks: ${response.status} ${response.statusText}`);
      }
      const data: Task[] = await response.json();
      setCompletedTasks(data);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
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
      const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000 / 60;

      try {
        const response = await fetch(`http://localhost:8080/tasks/task/${currentTask.id}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ time: currentTask.time + timeSpent }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task time');
        }

        setTasks(tasks.filter((task) => task.id !== currentTask.id));
        setCompletedTasks([...completedTasks, { ...currentTask, time: currentTask.time + timeSpent }]);
      } catch (error) {
        console.error('Error stopping task:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Time Tracker</h1>
      <TaskForm addTask={addTask} />
      
      {/* Active Tasks */}
      <TaskList tasks={tasks} removeTask={removeTask} startTask={startTask} title="Active Tasks" />
      
      {/* Completed Tasks */}
      <TaskList tasks={completedTasks} removeTask={removeTask} title="Completed Tasks" />
      
      {currentTask && <TaskTimer task={currentTask} stopTask={stopTask} />}
    </div>
  );
}

export default App;

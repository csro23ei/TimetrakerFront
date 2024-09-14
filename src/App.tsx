import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskTimer from './TaskTimer';
import { Task, NewTask } from './task'; 
import { formatTime } from './timeUtils';
import './App.css';  // Import CSS for styling

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
      
      // Beräkna den tid som spenderats i sekunder
      const timeSpentInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  
      try {
        const response = await fetch(`http://localhost:8080/tasks/task/${currentTask.id}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ time: currentTask.time + timeSpentInSeconds }), // Lägger till sekunder
        });
  
        if (!response.ok) {
          throw new Error('Failed to update task time');
        }
  
        // Uppdatera listorna med formaterad tid
        setTasks(tasks.filter((task) => task.id !== currentTask.id));
        setCompletedTasks([
          ...completedTasks,
          { ...currentTask, time: currentTask.time + timeSpentInSeconds },
        ]);
        setCurrentTask(null);
      } catch (error) {
        console.error('Error stopping task:', error);
      }
    }
  };
  

  // Function to edit task name
  const editTask = async (id: string, newName: string) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/task/${id}/name`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskName: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task name');
      }

      const updatedTask: Task = await response.json();
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task name:', error);
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        <div className="task-section">
          <h1>Time Tracker</h1>
          <TaskForm addTask={addTask} />
          
          {/* Active Tasks */}
          <TaskList
            tasks={tasks.map(task => ({
              ...task,
              timeFormatted: formatTime(task.time) // Format time in seconds
            }))}
            removeTask={removeTask}
            startTask={startTask}
            editTask={editTask}
            title="Active Tasks"
          />
          
          {/* Completed Tasks */}
          <TaskList
            tasks={completedTasks.map(task => ({
              ...task,
              timeFormatted: formatTime(task.time) // Format time in seconds
            }))}
            removeTask={removeTask}
            title="Completed Tasks"
          />
          
          {currentTask && <TaskTimer task={currentTask} stopTask={stopTask} />}
        </div>

        {/* Info box */}
        <div className="info-box">
          <h2>Information</h2>

          
            <p> Om du har Avslutar en uppgift uppdateras den endast i backend/databasen.</p>
          
          <p>
            Du kan endast ändra namnet på uppgiften och du kan ta bort den, men den reagerar
            endast direkt om uppgiften är i Aktiva uppgifter.
          </p>
          <p>

          Jag skulle bara ha ha gjort om examination på att läga upp på digital OCEAN jag hoppas på att deta bevisar att jag klarar av den delen med.
          </p>


        </div>
      </div>
    </div>
  );
}

export default App;

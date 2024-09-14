import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import './App.css'; 
interface Task {
  id: number;
  name: string;
  timeElapsed: number;
  intervalId?: ReturnType<typeof setInterval>; 
}

const App: React.FC = () => {
 
  const [tasks, setTasks] = useState<Task[]>([]);

  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    setTasks(savedTasks);
    setCompletedTasks(savedCompletedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const startTask = (taskId: number) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    const activeTaskIndex = tasks.findIndex(task => task.intervalId);
    
    if (taskIndex !== -1 && activeTaskIndex === -1) {
      const startTime = Date.now();
      const intervalId = setInterval(() => {
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
        setTasks(prevState => {
          const updatedTasks = [...prevState];
          updatedTasks[taskIndex].timeElapsed = timeElapsed;
          return updatedTasks;
        });
      }, 1000);
  
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex].intervalId = intervalId;
      setTasks(updatedTasks);
    } else if (activeTaskIndex !== -1) {
      
      const confirmMessage = "Det finns redan en aktiv uppgift. Vill du starta en till? OK komer låta dig starta två saker samtidigt";
      const result = window.confirm(confirmMessage);
      if (result) {
    
        const startTime = Date.now();
        const intervalId = setInterval(() => {
          const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
          setTasks(prevState => {
            const updatedTasks = [...prevState];
            updatedTasks[taskIndex].timeElapsed = timeElapsed;
            return updatedTasks;
          });
        }, 1000);
  
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex].intervalId = intervalId;
        setTasks(updatedTasks);
      }
    }
  };
  
  const stopTask = (taskId: number) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1 && tasks[taskIndex].intervalId) {
      clearInterval(tasks[taskIndex].intervalId);
      const completedTask = tasks[taskIndex];
      setCompletedTasks(prevState => [...prevState, completedTask]);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
    }
  };

 
  const removeCompletedTask = (taskId: number) => {
    const updatedCompletedTasks = completedTasks.filter(task => task.id !== taskId);
    setCompletedTasks(updatedCompletedTasks);
  };


  const addTask = (taskName: string) => {
    const newTask = {
      id: Date.now(),
      name: taskName,
      timeElapsed: 0,
    };
    setTasks(prevState => [...prevState, newTask]);
  };

  return (
    <div className="app-container">
      <div className="task-section">
        <h2>Vad gör du nu?</h2>
        <TaskForm onSubmit={addTask} />
        <div className="task-container">
         
          <TaskList tasks={tasks} onStart={startTask} onStop={stopTask} />
        </div>
      </div>
      <div className="completed-task-section">
        <h2>Det har du gjort</h2>
        <div className="completed-task-container">
          <h3>Avslutade uppgifter</h3>
          <ul>
            {completedTasks.map(task => (
              <li key={task.id} className="completed-task-item">
                {task.name} - {Math.floor(task.timeElapsed / 3600)} timmar {Math.floor((task.timeElapsed % 3600) / 60)} minuter {task.timeElapsed % 60} sekunder
                <button onClick={() => removeCompletedTask(task.id)}>Ta bort</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;



import React, { useState } from "react";

function AddTask() {
  const [newTask, setNewTask] = useState<string>("");

  const addNewTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskName: newTask }),
      });

      if (response.ok) {
        setNewTask("");
        alert("Your task has been added!");
      } else {
        alert("Failed to add task. Please try again.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={addNewTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new tasks"
          required
        ></input>
        <button className="addBtn">Add</button>
      </form>
    </div>
  );
}

export default AddTask;

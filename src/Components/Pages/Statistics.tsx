import React from "react";
import ListActiveTasks from "../ListActiveTasks";
import ListInactiveTasks from "../ListInactiveTasks";

function Statistics() {
  return (
    <div>
      <h2>Statistics</h2>
      <ListActiveTasks />
      <ListInactiveTasks />
    </div>
  );
}

export default Statistics;
import { useState } from "react";
import TaskList from "../components/TaskList";

const TaskWindow = ({ tasks, handleComplete }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const toggleCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <div>
      <button onClick={toggleCompleted}>
        {!showCompleted ? "Show Completed" : "Show Active"}
      </button>
      <TaskList
        tasks={tasks}
        handleComplete={handleComplete}
        isCompleted={showCompleted}
      />
    </div>
  );
};

export default TaskWindow;

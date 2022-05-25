import { useState } from "react";
import TaskList from "../components/TaskList";

const TaskWindow = ({ tasks, handleComplete }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const toggleCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <div>
      <div className="flex justify-center">
        <button onClick={toggleCompleted} className="text-xl">
          {!showCompleted ? "Show Completed" : "Show Active"}
        </button>
      </div>
      <TaskList
        tasks={tasks}
        handleComplete={handleComplete}
        isCompleted={showCompleted}
      />
    </div>
  );
};

export default TaskWindow;

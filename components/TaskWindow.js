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
        <button
          onClick={toggleCompleted}
          className="text-l bg-slate-900 p-3 rounded-xl mt-4 uppercase"
        >
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

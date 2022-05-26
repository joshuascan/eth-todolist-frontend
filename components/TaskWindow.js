import { useState } from "react";
import TaskList from "../components/TaskList";

const TaskWindow = ({ tasks, handleComplete }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex bg-slate-700 w-fit mt-3 rounded-xl justify-center">
        <button
          onClick={() => setShowCompleted(false)}
          className={`text-l ${
            !showCompleted ? "bg-slate-900" : ""
          } p-3 rounded-xl uppercase`}
        >
          Active
        </button>
        <button
          onClick={() => setShowCompleted(true)}
          className={`text-l ${
            showCompleted ? "bg-slate-900" : ""
          } p-3 rounded-xl uppercase`}
        >
          Completed
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

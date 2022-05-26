const TaskList = ({ tasks, handleComplete, isCompleted }) => {
  return (
    <div className="w-full">
      {tasks.map((task) => {
        if (isCompleted === task.completed)
          return (
            <div
              key={task.id}
              className="flex my-8 pr-6 rounded items-center bg-slate-600 h-16 w-full"
            >
              <button
                type="button"
                value={task.id}
                onClick={handleComplete}
                className={`h-16 w-16 mr-2 rounded ${
                  task.completed
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-teal-400 hover:bg-teal-600"
                } hover:bg-purple-800 duration-200`}
              >
                {task.completed ? "Undo" : "✓"}
              </button>
              <div>
                <p className="text-lg">{task.description}</p>
                <p className="text-sm text-slate-300/75">
                  {task.timestamp.toString()}
                </p>
              </div>
            </div>
          );
      })}
    </div>
  );
};

export default TaskList;

const TaskList = ({ tasks, handleComplete, isCompleted }) => {
  return (
    <div>
      {tasks.map((task) => {
        if (isCompleted === task.completed)
          return (
            <div key={task.id} className="flex">
              <button type="button" value={task.id} onClick={handleComplete}>
                ✅
              </button>
              <div>
                <p>{task.description}</p>
                <p>{task.timestamp.toString()}</p>
              </div>
            </div>
          );
      })}
    </div>
  );
};

export default TaskList;

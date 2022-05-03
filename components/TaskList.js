const TaskList = ({ tasks, handleComplete, isCompleted }) => {
  return (
    <div>
      {tasks.map((task) => {
        if (isCompleted === task.completed)
          return (
            <div key={task.id}>
              <input
                type="checkbox"
                value={task.id}
                checked={task.completed}
                onChange={handleComplete}
              />
              <p>{task.description}</p>
              <p>{task.timestamp.toString()}</p>
            </div>
          );
      })}
    </div>
  );
};

export default TaskList;
